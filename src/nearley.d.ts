declare module "nearley" {
    export class Parser {
        constructor(rules: {[s:string]:any}, start: string);
        feed(sentence: string) : { results : any[]; }
        finish() : any[];
    }
}
