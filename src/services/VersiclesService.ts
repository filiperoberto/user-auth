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

        return new Promise((resolve, reject) => {

            let promises = [];
            let nextAndPrev: NextAndPrevVersicles = {}

            promises.push(this.versiclesRepository.nextBook(filter));
            promises.push(this.versiclesRepository.prevBook(filter));

            Promise.all(promises).then(([next, prev]) => {

                if (next[0]) {
                    nextAndPrev.next = {
                        book: next[0].liv_abbr
                    }
                }
                if (prev[0]) {
                    nextAndPrev.prev = {
                        book: prev[0].liv_abbr
                    }
                }
                resolve(nextAndPrev);
            })

        })
    }

    public getNextAndPrevChapter(filter: VersiclesFilter): Promise<NextAndPrevVersicles> {

        debugger;

        return new Promise((resolve, reject) => {

            let promises = [];
            let nextAndPrev: NextAndPrevVersicles = {}

            promises.push(this.versiclesRepository.nextChapter(filter));
            promises.push(this.versiclesRepository.prevChapter(filter));

            Promise.all(promises).then(([next, prev]) => {

                if (next[0]) {
                    nextAndPrev.next = {
                        book: next[0].liv_abbr,
                        chapter: next[0].ver_capitulo
                    }
                }
                if (prev[0]) {
                    nextAndPrev.prev = {
                        book: prev[0].liv_abbr,
                        chapter: prev[0].ver_capitulo
                    }
                }
                resolve(nextAndPrev);
            })

        })

    }
}