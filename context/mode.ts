import { createDomain } from 'effector-next'

const mode = createDomain()

export const setMode = mode.createEvent<string>()

//Тема светлая/темная
export const $mode = mode
  .createStore<string>('light') //Изначально светлая тема
  .on(setMode, (_, mode) => mode)