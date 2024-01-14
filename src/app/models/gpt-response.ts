export interface ResponseModel  {
    id:string;
    object: string;
    created:number;
    model:string;
    choices:choice[];
    modelUsage:usage;
}



export interface choice {
    text:string;
    index:number;
    logprobs:any;
    finish_reason:string;
    message?: []
}

export interface usage {
    prompt_tokens:number;
    completion_tokens: number;
    total_tokens:number;
}

export interface ChatWithBot {
    person: string;
    response: string;
    cssClass:string;
}

export interface ResponseModelTurbo  {
    id:string;
    object: string;
    created:number;
    model:string;
    choicesTurbo:choice
    modelUsage:usage;
}

export interface choicesTurbo {
    text:string;
    index:number;
    logprobs:any;
    finish_reason:string;
    message: message[]
}

export interface message  {
    role:string;
    content: string;
    }