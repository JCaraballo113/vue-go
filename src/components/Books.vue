<template>
  <div class="container">
    <div class="row">
      <div class="row">
        <div class="col">
          <h1 class="mt-3">Books</h1>
        </div>

        <hr />
        <div class="filters text-center">
          <span
            class="filter me-1"
            :class="{ active: currentFilter === 0 }"
            @click="setFilter(0)"
            >ALL</span
          >
          <span
            @click="setFilter(genre.id)"
            class="filter me-1"
            v-for="genre in genres"
            :key="genre.id"
            :class="{ active: currentFilter === genre.id }"
          >
            {{ genre.genre_name }}
          </span>
        </div>
        <hr />
        <div>
          <div class="card-group">
            <TransitionGroup class="p-3 d-flex flex-wrap" tag="div" appear name="books">
              <div v-for="b in books" :key="b.id">
                <div
                  class="card me-2 ms-1 mb-3"
                  style="width: 10rem"
                  v-if="currentFilter === 0 || isPartOfGenre(b)"
                >
                  <RouterLink :to="`/books/${b.slug}`">
                    <img
                      :src="`${imgPath}/covers/${b.slug}.jpg`"
                      class="card-img-top"
                      :alt="`cover for ${b.title}`"
                    />
                    <div class="card-body text-center">
                      <h5 class="card-title">{{ b.title }}</h5>
                      <p class="book-author card-text">{{ b.author.author_name }}</p>
                      <small
                        class="text-muted book-genre"
                        v-for="(g, index) in b.genres"
                        :key="g.id"
                      >
                        <em class="me-1">{{ g.genre_name }}</em>
                        <template v-if="index !== b.genres.length - 1">, </template>
                      </small>
                    </div></RouterLink
                  >
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { store } from "@/store";
import type { Book, Genre } from "./types";

export default {
  name: "Books",
  data() {
    return {
      store,
      ready: false,
      imgPath: import.meta.env.VITE_APP_IMAGE_URL,
      books: [] as Book[],
      genres: [] as Genre[],
      currentFilter: 0,
    };
  },
  emits: ["error"],
  async beforeMount() {
    try {
      const genresResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/genres`);
      const {
        error: genresError,
        message: genresErrorMessage,
        data: { genres },
      }: {
        error: boolean;
        message: string;
        data: { genres: Genre[] };
      } = await genresResponse.json();

      if (genresError) {
        this.$emit("error", genresErrorMessage);
        return;
      }

      const booksResponse = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/books${
          this.currentFilter !== 0 ? `?genres=${this.currentFilter}` : ""
        }`
      );
      const {
        error,
        message,
        data: { books },
      }: {
        error: boolean;
        message: string;
        data: { books: Book[] };
      } = await booksResponse.json();

      if (error) {
        this.$emit("error", message);
        return;
      } else {
        this.books = books;
        this.genres = genres;
        this.ready = true;
      }
    } catch (error) {
      this.$emit("error", error);
    }
  },
  methods: {
    setFilter(filter: number) {
      this.currentFilter = filter;
    },
    isPartOfGenre(book: Book) {
      return book.genres.some((g) => g.id === this.currentFilter);
    },
  },
};
</script>
<style lang="css" scoped>
.book-author,
.book-genre {
  font-size: 0.8em;
}

.filters {
  height: 2.5em;
}

.filter {
  padding: 6px 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.35s;
  border: solid 1px silver;
}

.filter:hover {
  background: lightgray;
}

.filter.active {
  background: lightgreen;
}

/* Transition styles */
.books-move {
  transition: all 500ms ease-in-out;
}

.books-enter-active {
  transition: all 500ms ease-in-out;
}

.books-leave-active {
  transition: all 500ms ease-in;
}

.books-enter,
.books-leave-to {
  opacity: 0;
}
</style>
