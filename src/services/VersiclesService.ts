import { VersiclesRepository } from "../server/db/queries/VersiclesRepository";
import { VersiclesFilter } from "../models/VersiclesFilter";
import { NextAndPrevVersicles } from "../models/NextAndPrevVersicles";

export class VersiclesService {
    private versiclesRepository: VersiclesRepository;

    constructor(versiclesRepository: VersiclesRepository) {
        this.versiclesRepository = versiclesRepository;
    }

    public getNextAndPrevBook(filter: VersiclesFilter): Promise<NextAndPrevVersicles> {

        debugger;

        return new Promise((resolve,reject) => {

            let promises = [];
            let nextAndPrev : NextAndPrevVersicles = {}

            if(filter.livro !== 'ap') {
                promises.push(this.versiclesRepository.nextBook(filter));
            }
            if(filter.livro !== 'gn') {
                promises.push(this.versiclesRepository.prevBook(filter));
            }

            Promise.all(promises).then(([next,prev]) => {

                if(filter.livro !== 'ap') {
                    nextAndPrev.next = {
                        book: next[0].liv_abbr
                    }
                } else {
                    nextAndPrev.prev = {
                        book: next[0].liv_abbr
                    }
                }
                if(prev) {
                    nextAndPrev.prev = {
                        book: prev[0].liv_abbr
                    }
                }
                resolve(nextAndPrev);
            })

        })
        
    }
}