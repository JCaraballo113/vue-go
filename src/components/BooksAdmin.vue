<template>
  <div class="container">
    <div class="row">
      <div class="row">
        <div class="col">
          <h1 class="mt-3">Manage Books</h1>
          <hr />

          <table v-if="ready" class="table table-striped table-compact">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book.id">
                <td>
                  <RouterLink :to="`/admin/books/${book.id}`">
                    {{ book.title }}
                  </RouterLink>
                </td>
                <td>{{ book.author.author_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Security from "./security";
import type { Book } from "./types";

export default defineComponent({
  name: "BooksAdmin",
  data() {
    return {
      books: [] as Book[],
      ready: false,
    };
  },
  async beforeMount() {
    Security.requireToken();
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/books`);
    const {
      error,
      message,
      data: { books },
    }: {
      error: boolean;
      message: string;
      data: { books: Book[] };
    } = await response.json();

    if (error) {
      this.$emit("error", message);
      return;
    } else {
      this.books = books;
      this.ready = true;
    }
  },
});
</script>
