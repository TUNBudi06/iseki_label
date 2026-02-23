<script lang="ts">
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    import { Input } from "$shadcn/components/ui/input/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldDescription,
        FieldError
    } from "$shadcn/components/ui/field/index.js";
    import DefaultLayout from "$/Layouts/DefaultLayout.svelte";
    import {router} from "@inertiajs/svelte";
    import {routeUrl} from "@tunbudi06/inertia-route-helper";
    import {home} from "$routes";
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
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel for="email-{id}">Email</FieldLabel>
                            <Input id="email-{id}" type="email" placeholder="m@example.com" required />
                        </Field>
                        <Field>
                            <div class="flex items-center">
                                <FieldLabel for="password-{id}">Password</FieldLabel>
                                <a href="##" class="ms-auto inline-block text-sm underline">
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password-{id}" type="password" required />
                        </Field>
                        <Field>
                            <Button type="submit" class="w-full">Login</Button>
                            <Button variant="outline" class="w-full" onclick={()=> router.visit(routeUrl(home()))}>
                                Back To Home
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </Card.Content>
        </Card.Root>
    </div>
</DefaultLayout>
