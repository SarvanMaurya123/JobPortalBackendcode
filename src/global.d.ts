// // src/global.d.ts
// declare module "bcryptjs" {
//     const hash: (password: string, saltOrRounds: number | string) => Promise<string>;
//     const compare: (password: string, hash: string) => Promise<boolean>;
//     export { hash, compare };
// }


declare module 'bcryptjs';

// global.d.ts
declare module 'uploadthing/react' {
    export const useUploadThing: any;
}
