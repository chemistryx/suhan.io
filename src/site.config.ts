// Site-specific content. Secrets and per-deployment values go in .env.
export const siteConfig = {
    author: {
        name: "하수한",
        alternateName: "Suhan Ha"
    },

    // default meta description
    description: "모두가 쉽게 사용할 수 있고, 실생활에서의 불편함을 해결할 수 있는 서비스를 만드는 데 관심이 많습니다.",

    // path under public/
    profileImage: "/profile.png",

    // corner label on OpenGraph images
    ogLabel: "suhan.io",

    // footer links; omit to hide
    links: {
        github: "https://github.com/chemistryx",
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL
    } as { github?: string; email?: string }
};

export const siteTitle = `${siteConfig.author.name} ${siteConfig.author.alternateName}`;
