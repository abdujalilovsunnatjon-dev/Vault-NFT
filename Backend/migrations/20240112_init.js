/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.integer('telegram_id').unique().notNullable();
      table.string('first_name').notNullable();
      table.string('last_name');
      table.string('username');
      table.string('language_code').defaultTo('en');
      table.boolean('is_premium').defaultTo(false);
      table.integer('points').defaultTo(0);
      table.float('ton_balance').defaultTo(0);
      table.datetime('created_at').defaultTo(knex.fn.now());
      table.datetime('last_seen').defaultTo(knex.fn.now());
    })
    .createTable('items', function (table) {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('image_url').notNullable();
      table.string('collection_id');
      table.float('price_ton').notNullable();
      table.string('rarity').defaultTo('common');
      table.integer('views').defaultTo(0);
      table.integer('likes').defaultTo(0);
      table.integer('owner_id').references('id').inTable('users');
      table.datetime('listed_at').defaultTo(knex.fn.now());
    })
    .createTable('collections', function (table) {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('image_url').notNullable();
      table.float('floor_price').defaultTo(0);
      table.float('total_volume').defaultTo(0);
      table.integer('item_count').defaultTo(0);
      table.datetime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('gifts', function (table) {
      table.string('id').primary();
      table.integer('sender_id').references('id').inTable('users').notNullable();
      table.integer('receiver_id').references('id').inTable('users').notNullable();
      table.string('item_id').references('id').inTable('items').notNullable();
      table.string('message');
      table.boolean('opened').defaultTo(false);
      table.datetime('sent_at').defaultTo(knex.fn.now());
      table.datetime('opened_at');
    })
    .createTable('season_stats', function (table) {
      table.integer('user_id').references('id').inTable('users').notNullable();
      table.integer('season_number').notNullable();
      table.integer('points').defaultTo(0);
      table.float('volume_ton').defaultTo(0);
      table.integer('items_bought').defaultTo(0);
      table.integer('items_sold').defaultTo(0);
      table.integer('referrals').defaultTo(0);
      table.integer('tasks_completed').defaultTo(0);
      table.integer('rank');
      table.datetime('last_updated').defaultTo(knex.fn.now());
      table.primary(['user_id', 'season_number']);
    })
    .createTable('tasks', function (table) {
      table.string('id').primary();
      table.string('title').notNullable();
      table.string('description');
      table.integer('points_reward').notNullable();
      table.string('type').defaultTo('daily');
      table.string('requirement');
      table.boolean('is_active').defaultTo(true);
      table.datetime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('user_tasks', function (table) {
      table.integer('user_id').references('id').inTable('users').notNullable();
      table.string('task_id').references('id').inTable('tasks').notNullable();
      table.boolean('completed').defaultTo(false);
      table.datetime('completed_at');
      table.boolean('claimed').defaultTo(false);
      table.datetime('claimed_at');
      table.primary(['user_id', 'task_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('user_tasks')
    .dropTableIfExists('tasks')
    .dropTableIfExists('season_stats')
    .dropTableIfExists('gifts')
    .dropTableIfExists('collections')
    .dropTableIfExists('items')
    .dropTableIfExists('users');
};
