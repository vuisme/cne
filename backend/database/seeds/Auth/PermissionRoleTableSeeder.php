<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Class PermissionRoleTableSeeder.
 */
class PermissionRoleTableSeeder extends Seeder
{
  use DisableForeignKeys;

  /**
   * Run the database seed.
   */
  public function run()
  {
    $this->disableForeignKeys();

    // Create Roles
    // Role::create(['name' => config('access.users.admin_role')]);
    // Role::create(['name' => config('access.users.default_role')]);

    $permissions = permissions_data();
    if (is_array($permissions)) {
      Artisan::call('cache:clear');
      Permission::truncate();
      foreach ($permissions as $permission) {
        $create = new Permission();
        $create->name = $permission['name'] ?? null;
        $create->description = $permission['description'] ?? null;
        $create->sort = $permission['sort'] ?? null;
        $create->guard_name = $permission['guard_name'] ?? null;
        $create->save();
        $children = $permission['children'] ?? null;
        unset($permission['children']);
        if (is_array($children)) {
          foreach ($children as $childData) {
            $child = new Permission();
            $child->name = $childData['name'] ?? null;
            $child->description = $childData['description'] ?? null;
            $child->sort = $childData['sort'] ?? null;
            $child->guard_name = $childData['guard_name'] ?? null;
            $child->parent_id = $create->id;
            $child->save();
          }
        }
      }
    }

    $this->enableForeignKeys();

    // php artisan db:seed --class=PermissionRoleTableSeeder
  }
}
