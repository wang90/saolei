export  interface Coordinates {
    row: number;
    col: number;
}
export interface Block {
    active: boolean;
    error: boolean;
    touched: boolean;
    value: number;
}
export interface Initialvalue {
    ROWS: number;
    COLS: number;
    COUNT: number;
}
