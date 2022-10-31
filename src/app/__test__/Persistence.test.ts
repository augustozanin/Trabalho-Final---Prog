import { app, setup } from "../../index"
import { afterAll, describe, expect, test } from "@jest/globals";
import supertest from "supertest";
import { getConnection } from "typeorm"

describe("persistence test", () => {

    afterAll(async () => {
        await getConnection().close()
    });

    beforeAll(async () => {
        await setup()
    });


    it('teste /endereco/list e /endereco/delete', async () => {
        var agent = supertest(app);
        const postList = await agent.get('/enderecos');
        expect(postList.statusCode).toEqual(200);
        if (postList.body.length > 0) {
            for (const e of postList.body) {

                const data = { "id": e.id };
                console.log("Encontrou o endereco: ");
                console.log(data);

                const postDelete = await agent.delete('/enderecos').send(data);

                console.log("Removeu o endereco: ");
                console.log(data);

                expect(postDelete.statusCode).toEqual(204);
            }
        } else {
            const data = { "cep": "Endereco de testes", "complemento": "402" };
            const postCreate = await agent.post('/enderecos').send(data);

            console.log("Cadastrou o endereco: ");
            console.log(postCreate);

            expect(postCreate.statusCode).toEqual(200);
        }
    });


    it('teste /jogador/list e /jogador/delete', async () => {
        var agent = supertest(app);
        const ret = await agent.get('/jogadores');
        expect(ret.statusCode).toEqual(200);

        if (ret.body.length > 0) {
            console.log(`Encontrou ${ret.body.length} jogadores cadastrados.`);

            for (const p of ret.body) {

                const data = { "nickname": p.nickname };
                console.log(`Removendo o jogador ${data.nickname}.`);
                const postDeleteJogador = await agent.delete('/jogadores').send(data);
                expect(postDeleteJogador.statusCode).toEqual(204);
                //esse remocao pode gerar alguma violacao de chave, caso o endereco esteja sendo referenciado por outro jogador.
                //ou aplicar a estratégia de cascade no ManytoOne
                if (typeof p.endereco != 'undefined') {

                    console.log(`Removendo o endereco ${p.endereco.id}.`);
                    const postDeleteEndereco = await agent.delete('/enderecos').send({ "id": p.endereco.id });
                    expect(postDeleteEndereco.statusCode).toEqual(204);
                }

            }
        } else {
            
            console.log("Não encontrou jogadores cadastrados, cadastrando novo jogador e endereco.");
            const postCreateEndereco = await agent.post('/enderecos').send({ "cep": "99010010" });
            expect(postCreateEndereco.statusCode).toEqual(200);
            const postFindEndereco = await agent.get('/enderecos').send({ "cep": "99010010" });
            expect(postFindEndereco.statusCode).toEqual(200);
            //console.log(postFindEndereco.body);
            const data = {
                "nickname": "t@g1.com",
                "senha": "11111",
                "pontos": 10,
                "endereco": postFindEndereco.body[0]
            };

            const postCreateJogador = await agent.post('/jogadores').send(data);
            expect(postCreateJogador.statusCode).toEqual(200);
        }
    });

    it('teste /mapa/list e /mapa/delete', async () => {
        var agent = supertest(app);
        const postList = await agent.get('/mapas');
        expect(postList.statusCode).toEqual(200);
        if (postList.body.length > 0) {
            for (const e of postList.body) {

                const id = { "id": e.id };
                console.log("Encontrou o mapa: ");
                console.log(id);



                const postDeleteMapa = await agent.delete('/mapas').send(id);
                expect(postDeleteMapa.statusCode).toEqual(204);



            }
        } else {
            console.log("Não encontrou mapas cadastrados, cadastrando novo mapa e local.");


            const postFindLocais = await agent.get('/locais').send();
            


            expect(postFindLocais.statusCode).toEqual(200);


            const postCreateMapa = await agent.post('/mapas').send({ "nome": "novomapa2", "locais":postFindLocais.body[0] });




            expect(postCreateMapa.statusCode).toEqual(200);
           /*
            expect(postFindLocais.statusCode).toEqual(200);
            //console.log(postFindEndereco.body);
            const data = {
                "nome": "local10",
                "cor": "rosa",
                "latitude": "9",
                "longitude": "441",
                "mapa": postFindLocais.body[0]
            };

            const postCreateLocal = await agent.post('/locais').send(data);
            expect(postCreateLocal.statusCode).toEqual(200);
            */
        }
    });

    it('teste /local/list e /local/delete', async () => {
        var agent = supertest(app);
        const postList = await agent.get('/locais');
        expect(postList.statusCode).toEqual(200);
        if (postList.body.length > 0) {
            for (const e of postList.body) {

                const id = { "id": e.id };
                console.log("Encontrou o local: ");
                console.log(id);

                const postDeleteLocal = await agent.delete('/locais').send(id);
                expect(postDeleteLocal.statusCode).toEqual(204);


            }
        } else {
            console.log("não achou locais cadastados");




        }
    });




});

