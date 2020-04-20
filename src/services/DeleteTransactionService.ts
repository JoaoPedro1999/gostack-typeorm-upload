import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findTransaction = await transactionsRepository.findOne(id);

    if (!findTransaction) {
      throw new AppError('Transaction does not exists!');
    }

    await transactionsRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
