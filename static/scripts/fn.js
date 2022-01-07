/*------------------------
   Content menu tracking
-------------------------- */

$(window).on("load", function() {
    let sections = []

    // Create intersection observer for all sections
    const observer = new IntersectionObserver((_entries) => {
        /* Use this version if you want to highlight all headers in the viewport. The enabled version tracks only the top-most visible header item
        let isSelected = false
        for (let section of sections) {
            let id = section.getAttribute("id")
            console.log(id)
            if (isElementInViewport(section) && !isSelected) {
                document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add("active")
                // isSelected = true
            } else {
                document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove("active")
            }
        }*/
        let visibleSections = sections.filter(s => isElementInViewport(s))
        let sortedVisibleSections = visibleSections.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
            // Unactivate all sections
        for (let section of sections) {
            document.querySelector(`nav li a[href="#${section.getAttribute("id")}"]`).parentElement.classList.remove("active")
        }
        // Activate top most visible in the viewport section
        if (sortedVisibleSections.length > 0) {
            document.querySelector(`nav li a[href="#${sortedVisibleSections[0].getAttribute("id")}"]`).parentElement.classList.add("active")
        }
    })

    // Track all headers that have an `id` applied
    document.querySelectorAll("h1[id]").forEach((section) => {
        observer.observe(section)
        sections.push(section)
    })
    document.querySelectorAll("h2[id]").forEach((section) => {
        observer.observe(section)
        sections.push(section)
    })
    document.querySelectorAll("h3[id]").forEach((section) => {
        observer.observe(section)
        sections.push(section)
    })
})

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

/*-----------------------------
    Versions
------------------------------- */

function loadVersions(url) {
    // Disable versions before they are loaded
    let button = $("#version-container button")
    button.css("pointer-events", "none")

    // Download JSON with version definitions for this particular design system (there is always one version file per design system at domain/version.json)
    $.getJSON(url, function(data) {
        // Get versions
        let versions = data.versions

        // Load versions into the container and set active version
        let menu = $("#version-container .dropdown-menu")

        menu.html("")
        for (let v of versions) {
            // Make the version that fits the current deploy target URL to be the selected one
            let currentVersion = window.location.href.indexOf(v.url) !== -1
            menu.append(`<a class="dropdown-item ${currentVersion ? "checked" : ""}" href="https:${v.url}">${v.name}</a>`)
            if (currentVersion) {
                button.html(`${v.name}`)
            }
        }

        // Enable interaction with the menu
        button.css("pointer-events", "")
    }).fail(function() {
        // If we for some reason fail to download the versions or if the versions don't exist yet, just hide the button, so it doesn't confuse users
        button.hidden = true
    })
}


/*-----------------------------
    Copy code
------------------------------- */

$(function() {
    $('[data-toggle="copy-from-sandbox"]').click(function(event) {
        // Get code of the sandbox
        event.preventDefault()
        const sandboxId = $(this).attr('data-target');
        const code = window.sandboxEngine.getCodeForSandboxId(sandboxId)
        const cb = navigator.clipboard;
        cb.writeText(code)
    });
})


/*-----------------------------
    Storybook handling
------------------------------- */

$(document).ready(function() {

    // Ping storybook for each frame embedding it and check if it is reachable, if so, show the content,
    // otherwise show formatted error message
    document.querySelectorAll("iframe.storybook").forEach((iframe) => {
        let src = iframe.getAttribute("src")
        fetch(src, {
                method: "GET",
                cache: "no-cache",
                mode: "no-cors"
            })
            .then(_ => {
                // Do nothing for the correct response, as we can't detect whether 
                // the page was truly reachable and contains storybook due to CORS protection
            })
            .catch(_ => {
                // Show error for the specific frame
                // [iframe] > storybook-container > storybook-state-wrapper > storybook-error.visible
                iframe.parentElement.parentElement.lastElementChild.style.visibility = "visible";
                iframe.parentElement.parentElement.firstElementChild.style.visibility = "hidden";
            });
    })
});


/*-----------------------------
    Sidebar menu for mobile
------------------------------- */

$("#sidebarCollapse").on("click", function(e) {
    // Toggle the dark / light mode when clicking the mode selector
    $(".docs-navigation").toggleClass("d-inline")
    e.preventDefault()
})



/*-----------------------------
    Sidebar menu for mobile
------------------------------- */

$(document).ready(function() {
    loadVersions(""); // TODO
    console.log("version loaded")
})