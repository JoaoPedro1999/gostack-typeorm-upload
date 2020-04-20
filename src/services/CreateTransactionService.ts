/* eslint-disable no-undef */
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    category,
    type,
    value,
  }: Request): Promise<Transaction | null> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError("You don't have enough credit :'(");
      }
    }

    if (!findCategory) {
      findCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(findCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      category: findCategory,
      type,
      value,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
