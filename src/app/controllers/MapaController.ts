import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import Mapa from '../models/Mapa';
import Local from '../models/Local';

class MapaController {

    async list(req: Request, res: Response){

        const repository = getRepository(Mapa);
        //retorna uma lista de objetos contendo os registros de tb_jogador

        const lista2 = await repository.createQueryBuilder('tb_mapa').leftJoinAndSelect("tb_mapa.locais", "local").getMany();

        //retorna uma lsita de objetos contendos os registros de tb_jogador e mais as vinculações com tb_endereco, caso exista.
        //const lista = await repository.createQueryBuilder('tb_jogador').innerJoinAndSelect("tb_jogador.endereco", "endereco").getMany();


        return res.json(lista2);
    }

    async store(req: Request, res: Response){

        const repository = getRepository(Mapa);//recupera o repositorio do jogador.

        console.log(req.body);//imprime na saida padrão a mensagem recebida. Isso é apenas para teste...

        const m = repository.create(req.body);//cria a entidade Jogador.

        await repository.save(m);//efetiva a operacao de insert.

        return res.json(m);//retorna o bojeto json no response.
        
    }
    //código fonte referente ao pdf da parte 6.
    async delete(req: Request, res: Response){

        const repository = getRepository(Mapa);//recupera o repositorio do jogador.

        const {id} = req.body;//extrai os atributos id e endereco do corpo da mensagem.
        
        const idExists = await repository.findOne({where :{id}});//consulta na tabela se existe um registro com o mesmo id da mensagem.

        if(idExists){
        
            await repository.remove(idExists);//caso exista, então aplica a remocao fisica. (corrigir erro no pdf 11)
            return res.sendStatus(204);//retorna o coigo 204.
        
        }else{
        
            return res.sendStatus(404);//se nao encontrar jogador para remover, retorna o codigo 404.
        }
    }

    //código fonte referente ao pdf da parte 6.
    async update(req: Request, res: Response){
    
        const repository = getRepository(Mapa);//recupera o repositorio do jogador.
    
        const {id} = req.body;//extrai os atributos id e endereco do corpo da mensagem.
    
        const idExists = await repository.findOne({where :{id}});//consulta na tabela se existe um registro com o mesmo id da mensagem.
        
        if(!idExists){
                return res.sendStatus(404);
        }
        
        const j = repository.create(req.body); //cria a entidade Jogador
        
        await repository.save(j); //persiste (update) a entidade na tabela.
        
        return res.json(j);
    }
       

}

export default new MapaController();