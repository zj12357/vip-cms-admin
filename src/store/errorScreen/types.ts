/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
export interface ErrorScreenState {
    type: null | ErrorScreenType;
}
export enum ErrorScreenType {
    CLIENT_ERROR,
    SERVER_ERROR,
}
