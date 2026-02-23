<script lang="ts">
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import { Input } from "$shadcn/components/ui/input/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldError
    } from "$shadcn/components/ui/field/index.js";
    import DefaultLayout from "$/Layouts/DefaultLayout.svelte";
    import {router,useForm} from "@inertiajs/svelte";
    import {routeUrl} from "@tunbudi06/inertia-route-helper";
    import {home} from "$routes";
    import {loginpost} from "$routes/user";

    const form = useForm({
        username: '',
        password: '',
        remember: false,
    });

    async function onsubmit(e: Event) {
        e.preventDefault();
        // Post via Inertia useForm — it will populate $form.errors on validation failure
        $form.post(routeUrl(loginpost()), {
            // keep the page state if desired, otherwise Inertia will redirect on success
            onError(errors) {
                // optionally log or show toast
                console.warn('Login errors', errors);
            },
            onFinish() {
                // you can perform cleanup here if needed
            }
        });
    }

    const id = $props.id();
</script>

<DefaultLayout>
    <div class="flex h-screen w-full items-center justify-center px-4">
        <Card.Root class="mx-auto w-full max-w-sm">
            <Card.Header>
                <Card.Title class="text-2xl">Login</Card.Title>
                <Card.Description>Enter your email below to login to your account</Card.Description>
            </Card.Header>
            <Card.Content>
                <form onsubmit={onsubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel for="username-{id}">Email</FieldLabel>
                            <Input id="username-{id}"
                                   bind:value={$form.username}
                                   placeholder="admin"
                                   required />
                            {#if $form.errors?.username}
                                <FieldError>{$form.errors.username}</FieldError>
                            {/if}
                        </Field>

                        <Field>
                            <div class="flex items-center">
                                <FieldLabel for="password-{id}">Password</FieldLabel>
                            </div>
                            <Input id="password-{id}"
                                   bind:value={$form.password}
                                   type="password"
                                   required />
                            {#if $form.errors?.password}
                                <FieldError>{$form.errors.password}</FieldError>
                            {/if}
                        </Field>

                        <Field>
                            <Button type="submit" class="w-full" disabled={$form.processing}>
                                {#if $form.processing}
                                    Processing...
                                {:else}
                                    Login
                                {/if}
                            </Button>

                            <Button variant="outline" class="w-full mt-2" onclick={()=> router.visit(routeUrl(home()))} type="button">
                                Back To Home
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </Card.Content>
        </Card.Root>
    </div>
</DefaultLayout>
