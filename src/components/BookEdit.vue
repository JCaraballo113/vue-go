<template>
  <div class="container">
    <div class="row">
      <div class="row">
        <div class="col">
          <h1 class="mt-3">Add/Edit Book</h1>
          <hr />
          <FormTag @bookEditEvent="submitHandler" name="bookForm" event="bookEditEvent">
            <template v-slot:formInputs>
              <div v-if="book.slug != ''" class="mb-3">
                <img
                  :src="`${imgPath}/covers/${book.slug}.jpg`"
                  class="img-fluid img-thumbnail book-cover"
                  alt="Book Cover"
                />
              </div>
              <div class="mb-3">
                <label for="formFile" class="form-label">Cover Image</label>
                <input
                  v-if="book.id === 0"
                  ref="coverInput"
                  type="file"
                  class="form-control"
                  id="formFile"
                  @change="loadCoverImage"
                  required
                  accept="image/jpeg"
                />
                <input
                  v-else
                  ref="coverInput"
                  type="file"
                  class="form-control"
                  id="formFile"
                  @change="loadCoverImage"
                  accept="image/jpeg"
                />
              </div>

              <TextInput
                v-model="book.title"
                type="text"
                required
                label="Title"
                :value="book.title"
                name="title"
              />
              <SelectInput
                name="author-id"
                label="Author"
                :items="authors"
                required
                v-model="book.author_id"
              />
              <TextInput
                v-model="book.publication_year"
                type="text"
                required
                label="Publication Year"
                :value="book.publication_year"
                name="publication-year"
              />

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  v-model="book.description"
                  class="form-control"
                  id="description"
                  name="description"
                  rows="3"
                />
              </div>

              <hr />

              <div class="float-start">
                <input type="submit" class="btn btn-primary me-2" value="Save" />
                <RouterLink to="/admin/books" class="btn btn-outline-secondary">
                  Cancel
                </RouterLink>
              </div>
              <div class="float-end">
                <a
                  v-if="book.id > 0"
                  class="btn btn-danger"
                  href="javascript:void(0);"
                  @click="confirmDelete(book.id)"
                >
                  Delete
                </a>
              </div>
            </template>
          </FormTag>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Security from "./security";
import FormTag from "./forms/FormTag.vue";
import TextInput from "./forms/TextInput.vue";
import SelectInput from "./forms/SelectInput.vue";
import notie from "notie";
import type { SelectItem } from "./types";

export default defineComponent({
  name: "BookEdit",
  components: { FormTag, TextInput, SelectInput },
  async beforeMount() {
    Security.requireToken();

    const bookId = this.$route.params.bookId as string;
    if (parseInt(bookId) > 0) {
    } else {
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/admin/authors/all`,
      Security.requestOptions({})
    );
    const { data, error, message } = await response.json();
    if (error) {
      this.$emit("error", message);
    } else {
      this.authors = data;
    }
  },
  data() {
    return {
      book: {
        id: 0,
        title: "",
        author_id: "0",
        publication_year: "0",
        description: "",
        cover: "",
        slug: "",
        genres: [],
        genre_ids: [],
      },
      authors: [],
      genres: [
        { value: "1", text: "Science Fiction" },
        { value: "2", text: "Fantasy" },
        { value: "3", text: "Romance" },
        { value: "4", text: "Thriller" },
        { value: "5", text: "Mystery" },
        { value: "6", text: "Horror" },
        { value: "7", text: "Classic" },
      ] as SelectItem[],
      imgPath: import.meta.env.VITE_APP_IMAGE_URL,
    };
  },
  methods: {
    async submitHandler() {
      try {
        const payload = {
          id: this.book.id,
          title: this.book.title,
          author_id: parseInt(this.book.author_id),
          publication_year: parseInt(this.book.publication_year),
          description: this.book.description,
          cover: this.book.cover,
          slug: this.book.slug,
          genre_ids: this.book.genre_ids,
        };

        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/admin/books/save`,
          Security.requestOptions(payload)
        );
        const { error, message } = await response.json();

        if (error) {
          this.$emit("error", message);
        } else {
          this.$emit("success", "Changes Saved");
          this.$router.push("/admin/books");
        }
      } catch (error) {
        this.$emit("error", error);
      }
    },
    loadCoverImage() {
      // @ts-expect-error
      const file: any = this.$refs.coverInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.book.cover = (reader.result as string)
            .replace("data:", "")
            .replace(/^.+,/, "");
          console.log(this.book.cover);
        };
      }
    },
    confirmDelete(id: number) {
      notie.confirm({
        text: "Are you sure you want to delete this book?",
        submitText: "Delete",
        submitCallback: async () => {
          const payload = {
            id,
          };

          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/admin/books/delete`,
            Security.requestOptions(payload)
          );
          const { error, message } = await response.json();
          if (error) {
            this.$emit("error", message);
          } else {
            this.$emit("success", "Book Deleted");
            this.$router.push("/admin/books");
          }
        },
      });
    },
    selectAuthor(authorId: string) {
      this.book.author_id = parseInt(authorId);
    },
  },
});
</script>

<style scoped lang="css">
.w-full {
  width: 100%;
}
</style>
