<script lang="ts">
    import Navbar from "$/Layouts/Navbar.svelte";
    import { Button } from '$shadcn/components/ui/button';
    import * as Card from '$shadcn/components/ui/card/index.js';
    import * as Dialog from '$shadcn/components/ui/dialog/index.ts';
    import { Input } from '$shadcn/components/ui/input';
    import { Label } from '$shadcn/components/ui/label';
    import * as Field from '$shadcn/components/ui/field/index.js';
    import * as Select from '$shadcn/components/ui/select/index.js';
    import {router, useForm} from '@inertiajs/svelte';
    import * as Table from '$shadcn/components/ui/table/index.js';
    import { TableHandler, Pagination, RowCount, Datatable } from "@vincjo/datatables";
    import { Pencil, Trash2, UserPlus, Shield, User } from '@lucide/svelte';
    import {onMount} from "svelte";
    import {route, routeUrl} from "@tunbudi06/inertia-route-helper";
    import {userDestroy, userStore, userUpdate} from "$routes/user";
    import {toast} from "svelte-sonner";
    let _ = Card
    _ = Dialog
    // @ts-ignore
    _ = Table
    // @ts-ignore
    _ = Select
    // @ts-ignore
    _ = Field

    let {users} = $props();

    type User = {
        id: number;
        name: string;
        username: string;
        role: 'admin' | 'user';
    };

    // Dialog state
    let dialogOpen = $state(false);
    let isEditing = $state(false);

    type UserForm = {
        id?: number;
        name: string;
        username: string;
        password?: string;
        role: 'admin' | 'user';
    };

    const form = useForm<UserForm>({
        id: undefined,
        name: '',
        username: '',
        password: '',
        role: 'user',
    });

    const table = new TableHandler([], {
        rowsPerPage: 5,
        highlight: true,
    });

    onMount(()=>{
        table.setRows(users);
    })

    const globalSearch = table.createSearch(['username','name'])

    // Reactive update when users change
    $effect(() => {
        table.setRows(users);
    });

    function resetForm() {
        $form.reset();
        isEditing = false;
    }

    function openAdd() {
        resetForm();
        dialogOpen = true;
    }

    function openEdit(user: User) {
        isEditing = true;
        $form.id = user.id;
        $form.name = user.name;
        $form.username = user.username;
        $form.role = user.role;
        $form.password = ''; // Clear password field for edits
        dialogOpen = true;
    }

    function closeDialog() {
        dialogOpen = false;
        resetForm();
    }

    // Create new user
    function createUser() {
        $form.post(routeUrl(userStore()), {
            onSuccess() {
                toast.success('User created successfully!');
                router.reload({
                    only:['users']
                });
            },
            onError(errors) {
                console.warn('Create user errors', errors);
            }
        });
        closeDialog();
    }

    // Update existing user
    function updateUser() {
        $form.put(routeUrl(userUpdate()), {
            onSuccess() {
                toast.success('User updated successfully!');
                router.reload({
                    only:['users']
                });
            },
            onError(errors) {
                console.warn('Update user errors', errors);
            }
        });
        closeDialog();
    }

    // Unified save handler
    function saveUser() {
        if (isEditing) {
            updateUser();
        } else {
            createUser();
        }
    }

            const tmp = useForm({
                id: 0,
            });
    function confirmDelete(user: User) {
        if (confirm(`Delete user ${user.name} (${user.username})?`)) {
            $tmp.id=user.id;
            $tmp.post(routeUrl(userDestroy()),{
                onSuccess() {
                    toast.success('User deleted successfully!');
                    router.reload({
                        only:['users']
                    });
                },
                onError(errors) {
                    console.warn('Delete user errors', errors);
                }
            })
        }
    }

    function getRoleBadgeClass(role: string) {
        return role === 'admin'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
</script>

<Navbar>
    <div class="mx-auto max-w-6xl p-4 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-semibold tracking-tight">User Management</h2>
                <p class="text-sm text-muted-foreground mt-1">
                    Manage application users — add, edit, or remove accounts.
                </p>
            </div>
            <Button onclick={openAdd} class="gap-2">
                <UserPlus class="w-4 h-4" />
                Add User
            </Button>
        </div>

        <!-- Data Table Card -->
        <Card.Root>
            <Card.Header>
                <Field.Field>
                    <Field.Label>Search:</Field.Label>
                    <Input type="text" placeholder="Search users..." bind:value={globalSearch.value} oninput={(e) => {
                        globalSearch.set();
                    }} />
                </Field.Field>
            </Card.Header>
            <Card.Content class="p-0">
                <Datatable {table}>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row class="hover:bg-transparent">
                                <Table.Head class="w-16">ID</Table.Head>
                                <Table.Head>Name</Table.Head>
                                <Table.Head>Username</Table.Head>
                                <Table.Head class="w-32">Role</Table.Head>
                                <Table.Head class="w-40 text-right">Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each table.rows as user (user.id)}
                                <Table.Row class="group">
                                    <Table.Cell class="font-mono text-sm text-muted-foreground">
                                        #{user.id}
                                    </Table.Cell>
                                    <Table.Cell class="font-medium">
                                        {@html user.name}
                                    </Table.Cell>
                                    <Table.Cell class="text-muted-foreground">
                                        @{@html user.username}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium {getRoleBadgeClass(user.role)}">
                                            {#if user.role === 'admin'}
                                                <Shield class="w-3 h-3" />
                                            {:else}
                                                <User class="w-3 h-3" />
                                            {/if}
                                            {user.role}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell class="text-right">
                                        <div class="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                class="h-8 w-8"
                                                onclick={() => openEdit(user)}
                                            >
                                                <Pencil class="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                class="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onclick={() => confirmDelete(user)}
                                            >
                                                <Trash2 class="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>

                    {#snippet footer()}
                        <div class="flex items-center w-full justify-between px-4 py-3 border-t">
                            <span class="text-sm text-muted-foreground">
                                Showing {table.rowCount.start} to {table.rowCount.end} of {table.rowCount.total} entries
                            </span>
                            <Pagination {table} />
                        </div>
                    {/snippet}
                </Datatable>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Add/Edit User Dialog -->
    <Dialog.Root bind:open={dialogOpen}>
        <Dialog.Content class="sm:max-w-md">
            <Dialog.Header>
                <Dialog.Title>{isEditing ? 'Edit User' : 'Add New User'}</Dialog.Title>
                <Dialog.Description>
                    {isEditing ? 'Update user details below.' : 'Fill in the information to create a new user account.'}
                </Dialog.Description>
            </Dialog.Header>

            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label for="name">Full Name</Label>
                    <Input
                        id="name"
                        bind:value={$form.name}
                        placeholder="Enter full name"
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="username">Username</Label>
                    <Input
                        id="username"
                        bind:value={$form.username}
                        placeholder="Enter username"
                    />
                </div>

                    <div class="grid gap-2">
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            bind:value={$form.password}
                            placeholder="Enter password"
                        />
                    </div>

                <div class="grid gap-2">
                    <Label for="role">Role</Label>
                    <Select.Root
                        type="single"
                        value={$form.role}
                        onValueChange={(v) => $form.role = v as 'admin' | 'user'}
                    >
                        <Select.Trigger class="w-full">
                            {$form.role === 'admin' ? 'Administrator' : 'User'}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="user">
                                <div class="flex items-center gap-2">
                                    <User class="w-4 h-4" />
                                    User
                                </div>
                            </Select.Item>
                            <Select.Item value="admin">
                                <div class="flex items-center gap-2">
                                    <Shield class="w-4 h-4" />
                                    Administrator
                                </div>
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <Dialog.Footer>
                <Button variant="outline" onclick={closeDialog}>
                    Cancel
                </Button>
                <Button onclick={saveUser}>
                    {isEditing ? 'Save Changes' : 'Create User'}
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</Navbar>
