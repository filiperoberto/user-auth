import { Conjuges } from './../models/Conjuges';
import ConjugesRepository from './../server/db/queries/ConjugesRepository';
import { PeopleRepository } from "../server/db/queries/PeopleRepository";
import { VersionsRepository } from "../server/db/queries/VersionsRepository";
import { Version } from "../models/Version";

export class PeopleService {
    
    private peoplerepository : PeopleRepository;
    private versionRepository: VersionsRepository;

    constructor(peoplerepository : PeopleRepository,versionRepository: VersionsRepository) {
        this.versionRepository = versionRepository;
        this.peoplerepository = peoplerepository;
    }

    public edit(version : Version, id: number) : Promise<Version> {

        version.id_pessoa = id;

        return new Promise((resolve,reject) => {

            this.versionRepository.getLastVersion(id).then(max => {

                if(!max.length) {
                    return reject({status : 404, error : {}})
                }

                version.version_number = (max[0].version_number + 1);

                for(let key in version) {
                    max[0][key] = version[key];
                }
                return this.createVersion(max[0], resolve, reject);
            }).catch(er => reject({status : 500, error : er}))
        })
    }

    private createVersion(version: Version, resolve: (value?: Version | PromiseLike<Version>) => void, reject: (reason?: any) => void): void | PromiseLike<void> {

        const conjuges = version.conjuges;
        delete version.conjuges;

        return this.versionRepository.create(version).then(id => {

            return this.addConjuges(version.id_pessoa, conjuges).then(() => {
                return this.versionRepository.getById(id).then(version => {
                    if (version.length) {
                        resolve(version.pop());
                    }
                    else {
                        reject({ status: 404, error: {} });
                    }
                });
            })
        });
    }

    private addConjuges(id_pessoa: number, conjuges: number[]){

        if(conjuges == undefined || conjuges.length === 0) {
            return Promise.resolve({})
        }

        return ConjugesRepository.delete(id_pessoa).then(() => {

            const c : Conjuges[] = conjuges.map(id => {
                return {
                    marido : id,
                    mulher : id_pessoa
                }
            })

            return ConjugesRepository.add(c);
        })
    }

    public create(version : Version) : Promise<Version> {

        return new Promise((resolve,reject) => {
            this.peoplerepository.create().then(id => {
                version.version_number = 1;
                version.id_pessoa = id;
                return this.createVersion(version, resolve, reject);
            }).catch(er => reject({status : 500, error : er}))
        })
    }

    public getDynamicTree(id: number){

        return new Promise((resolve,reject) => {
            this.peoplerepository.getAllForDynamicTree().then(people => {

                let map = {};
                let desiredNode;

                people.forEach(person => {
                    if(person.id == id) {
                        desiredNode = person;
                    }

                    person.name = person.nome;
                    delete person.nome;
                    person.data = {};
                    person.children = [];
    
                    if(!person.pai) {
                        return;
                    }
    
                    if(!map[person.pai]) {
                        map[person.pai] = [];
                    }
                    map[person.pai].push(person);
                });

                if(!desiredNode) {
                    return reject({status: 404, error : {}});
                }

                people.forEach(person => {    
                    if(map[person.id]) {
                        person.children = map[person.id];
                    }
                    delete person.pai;
                })

                resolve(desiredNode);
            }).catch(er => reject({status : 500, error : er}))
        })
    }
}