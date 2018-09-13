import { Filter } from "../util/filter";

export interface VersionsFilter extends Filter {

    person : number;
    user : number;
    admin: boolean;

}