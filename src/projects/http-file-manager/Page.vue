<script setup>
import stackDiagram from './assets/stack.png'
</script>

<template>
    <div class="project-article http-file-manager-article">
        <section class="project-article__section">
            <p class="detail-text">
                <strong>Features.</strong> This project starts from a hand-written HTTP server and then builds a usable file manager on top of it, including view and download, upload and delete, cookie / session handling, chunked transfer, range requests, and an optional encrypted transport mode.
            </p>
            <p class="detail-text">
                <strong>Stack.</strong> Python, sockets, asynchronous event processing, custom HTTP request / response parsing, Flask-like route registration, HTML templates, and <code>pycryptodome</code> for the encrypted communication extension.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Background</h2>
            <p>
                This is a course assignment for a computer networks course during my bachelor's degree studies. The requirement is to implement a server-side application that supports HTTP/1.0 using only sockets, without relying on any frameworks, and then implement a file management application based on it.
            </p>
            <p>
                Therefore, this project is primarily used to put theoretical knowledge of computer networks into practice. Furthermore, our implemented backend server supports a Flask-like routing registration framework, decoupled from the application, and has strong reusability.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Architecture</h2>
            <p>
                The project is organized around <code>myhttp</code> and <code>file_manager</code>. I did that on purpose: the server should still make sense as a reusable HTTP framework, while the file manager should feel like an application that happens to run on that framework instead of a pile of request handlers with no structure.
            </p>
            <p>
                In practice, the lower layer owns sockets, connections, request and response messages, headers, and parsing; the upper layer owns directory views, stored resources, user-facing actions, and the page rendering logic. That separation is what made it possible to keep adding protocol features without turning the application code into raw byte handling.
            </p>
            <figure class="project-media project-media--medium">
                <img :src="stackDiagram" alt="HTTP file manager stack diagram" />
                <figcaption>The repository is split into a reusable HTTP layer and the file-manager application built on top of it.</figcaption>
            </figure>
        </section>

        <section class="project-article__section">
            <h2>The HTTP core</h2>
            <p>
                In my opinion, the most crucial part of this task is persistent connections, message length determination, and concatenation.
            </p>
            <p>
                That means handling annoying but real cases such as partial requests in one <code>recv</code> buffer, multiple requests arriving back-to-back, and chunked transfer where the body cannot simply be read in one go. The message layer in <code>myhttp.message</code> formalizes URLs, request lines, status lines, headers, and full messages so parsing and serialization are not spread across the server codebase.
            </p>
        </section>

        <section class="project-article__section">
            <h2>The file manager application</h2>
            <p>
                The final feature set includes directory view and download (supporting chunked transfer), upload, delete, cookies and sessions for authenticated access, and boundary-case handling such as name collisions, missing folders, multiple uploaded files in one request, and root-folder protection.
            </p>
            <p>
                I also treated browser-facing details as part of the engineering problem instead of decoration. The repository has templates, CSS, frontend JavaScript, icon fonts, and a page-rendering path, so the UI is generated as an actual web application rather than raw response strings.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Encrypted connection</h2>
            <p>
                There is also an encrypted communication mode implemented by swapping the normal connection handler for <code>EncryptedHTTPConnectionHandler</code>. This part was finished by my teammate.
            </p>
        </section>

        <section class="project-article__section">
            <h2>Discussion</h2>
            <p>
                The value of this project is not just that I wrote an HTTP server from scratch. It is that I carried that server far enough that application-level requirements started shaping the protocol implementation, and protocol-level realities started shaping the application. That feedback loop is what makes it more useful than a toy protocol parser.
            </p>
        </section>
    </div>
</template>
