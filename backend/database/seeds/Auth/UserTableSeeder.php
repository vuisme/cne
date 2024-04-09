<?php

use App\Models\Auth\User;
use Illuminate\Database\Seeder;

/**
 * Class UserTableSeeder.
 */
class UserTableSeeder extends Seeder
{
  use DisableForeignKeys;

  /**
   * Run the database seed.
   */
  public function run()
  {
    $this->disableForeignKeys();

    // Add the master administrator, user id of 1
    User::create([
      'name' => 'Super Admin',
      'first_name' => 'Super',
      'last_name' => 'Admin',
      'name' => 'Super Admin',
      'phone' => '01734905649',
      'email' => 'admin@admin.com',
      'password' => 'secret',
      'confirmation_code' => md5(uniqid(mt_rand(), true)),
      'confirmed' => true,
    ]);

    User::create([
      'name' => 'Default User',
      'first_name' => 'Default',
      'last_name' => 'User',
      'name' => 'Super Admin',
      'phone' => '01515234363',
      'email' => 'user@user.com',
      'password' => 'secret',
      'confirmation_code' => md5(uniqid(mt_rand(), true)),
      'confirmed' => true,
    ]);

    $this->enableForeignKeys();
  }
}
