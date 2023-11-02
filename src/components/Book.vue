<template>
  <div class="container">
    <div v-if="ready" class="row">
      <div class="col-md-2">
        <img
          class="img-flui img-thumbnail"
          :src="`${imgPath}/covers/${book.slug}.jpg`"
          alt="cover"
        />
      </div>
      <div class="col-md-10">
        <h3 class="mt-3">{{ book.title }}</h3>
        <hr />
        <p>
          <strong>Author:</strong> {{ book.author.author_name }}
          <strong>Published:</strong> {{ book.publication_year }}
        </p>
        <p>{{ book.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Book } from "./types";

export default {
  data() {
    return {
      book: {} as Book,
      imgPath: import.meta.env.VITE_APP_IMAGE_URL,
      ready: false,
    };
  },
  async beforeMount() {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/books/${this.$route.params.bookName}`
    );
    const { error, message, data } = await response.json();
    if (error) {
      this.$emit("error", message);
    } else {
      this.book = data;
      this.ready = true;
    }
  },
};
</script>
