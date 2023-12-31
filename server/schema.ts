import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  numeric,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    password: text('password').notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex('name_idx').on(table.name),
  })
);

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  image: text('image').notNull().default(''),
  price: numeric('price', { precision: 15, scale: 4 }).notNull(),
});
