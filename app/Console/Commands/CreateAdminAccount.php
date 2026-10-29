<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminAccount extends Command
{
    protected $signature = 'admin:setup-vane';
    protected $description = 'Configura y actualiza la cuenta administradora vaneadmin@ldrcomercial.com';

    public function handle(): int
    {
        $user = User::updateOrCreate(
            ['email' => 'vaneadmin@ldrcomercial.com'],
            [
                'name' => 'Administradora Vane',
                'password' => Hash::make('agosto06@'),
                'role' => 'admin',
                'phone' => '+59170000000',
                'email_verified_at' => now(),
            ]
        );

        $this->info("✓ Cuenta administradora configurada exitosamente:");
        $this->line("  ID: {$user->id}");
        $this->line("  Nombre: {$user->name}");
        $this->line("  Email: {$user->email}");
        $this->line("  Rol: {$user->role}");

        $this->newLine();
        $this->info("Listado de empresas y sus cuentas asociadas:");
        $users = User::with('company')->get();
        foreach ($users as $u) {
            $compName = $u->company ? $u->company->name : '(Sin empresa)';
            $this->line("  • User ID {$u->id}: {$u->email} [{$u->role}] -> Empresa: {$compName}");
        }

        return Command::SUCCESS;
    }
}

