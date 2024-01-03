<!-- <script context="module">
    import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

    export async function load({ fetch }) {
        const locale = getLocaleFromNavigator();
        const response = await fetch(`/locales/${locale}.json`);
        const messages = await response.json();

        addMessages(locale, messages);
        init({
            fallbackLocale: 'en-US',
            initialLocale: locale,
        });
    }

    // https://kit.svelte.dev/docs/adapter-static
    export const prerender = false;


    // https://kit.svelte.dev/docs/page-options#trailingslash
    // export const trailingSlash = 'igonre';
</script>

<slot /> -->



<script context="module">
    import { init, getLocaleFromQueryString } from 'svelte-i18n';

    init({
    // fallback to en if current locale is not in the dictionary
    fallbackLocale: 'en',
    initialLocale: getLocaleFromQueryString('lang'),
    });
</script>
<slot />