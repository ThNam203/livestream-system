// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

// const axiosUIErrorHandler = (error: any, toast: any, router: AppRouterInstance) => { // toast is gotten from useToast()
//   if (error.response) {
//     if (error.response.status === 401 || error.response.status === 403) {
//       return router.push("/login");
//     } else toast({
//       description: error.response.data.message,
//       variant: "destructive",
//     });
//   } else if (error.request) {
//     toast({
//       description:
//         "Something has gone wrong with the server, please try again!",
//       variant: "destructive",
//     });
//   } else {
//     toast({
//       description: "Something has gone wrong!",
//       variant: "destructive",
//     });
//   }
// };

// export {
//     axiosUIErrorHandler
// }
