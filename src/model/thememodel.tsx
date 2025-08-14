import { Coordinates } from "./codenates";

export interface ThemeModel {
    theme: boolean
}

export interface showAllProps extends ThemeModel, Coordinates {} 
