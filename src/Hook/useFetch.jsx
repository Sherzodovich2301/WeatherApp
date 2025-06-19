import { useEffect, useState } from "react";

export  function useFetch(url) {

    const [api, setApi] = useState(null)
    useEffect(()=>{
        const FetchApi = async() =>{
            const request = await fetch(url);
            const response = await request.json();
            setApi(response)
        }
        FetchApi()
    })
    
    return {api}
}













































// import { useEffect, useState } from "react"
// export function useFetch(url) {
//     const [api, setApi] = useState(null)
//      useEffect(()=>{
//         const FetchHook = async() =>{
//             const request = await fetch(url);
//             const response = await request.json();
//             setApi(response)
//         }
//         FetchHook()
//      })

//   return {api}
// }
