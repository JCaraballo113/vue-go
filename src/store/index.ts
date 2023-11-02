import { reactive } from "vue";
interface State {
    token: string,
    user: {
        id?: string,
        first_name?: string,
        last_name?: string,
        email?: string
        password?: string
    }
}
export const store = reactive<State>({
    token: "",
    user: {}
});