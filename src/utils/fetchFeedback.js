import { VITE_MAIN_API } from "../data/data";
import supabaseClient from "../supabaseClient";

export default async()=>{
    const {data,statusText} = await supabaseClient.from("feedback").select("*")
    return data
}