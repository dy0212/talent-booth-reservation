module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/page.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$booths$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/booths.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BoothCard$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BoothCard.js [app-rsc] (ecmascript)");
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("h1", {
                children: "재능나눔 부스 예약"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: "booth-list",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$booths$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["booths"].map((booth)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BoothCard$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        booth: booth
                    }, booth.id))
            })
        ]
    });
}
}),
"[project]/app/page.js [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.js [app-rsc] (ecmascript)"));
}),
"[project]/components/BoothCard.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BoothCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
function BoothCard({ booth }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: "booth-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("h2", {
                children: booth.name
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("p", {
                children: booth.description
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("strong", {
                        children: "장소:"
                    }),
                    " ",
                    booth.location
                ]
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                href: `/booth/${booth.id}`,
                children: "상세 보기"
            })
        ]
    });
}
}),
"[project]/data/booths.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "booths",
    ()=>booths
]);
const booths = [
    {
        id: 1,
        name: "나만의 키링 만들기",
        description: "원하는 색과 장식을 골라 자신만의 키링을 만드는 체험입니다.",
        location: "본관 101호",
        sessions: [
            {
                id: 101,
                round: 1,
                startTime: "09:00",
                endTime: "09:30",
                capacity: 10,
                reserved: 6
            },
            {
                id: 102,
                round: 2,
                startTime: "09:40",
                endTime: "10:10",
                capacity: 10,
                reserved: 9
            },
            {
                id: 103,
                round: 3,
                startTime: "10:20",
                endTime: "10:50",
                capacity: 10,
                reserved: 10
            }
        ]
    },
    {
        id: 2,
        name: "간단한 웹게임 만들기",
        description: "HTML과 JavaScript를 이용해 간단한 웹게임을 만들어 보는 체험입니다.",
        location: "정보과학실",
        sessions: [
            {
                id: 201,
                round: 1,
                startTime: "09:00",
                endTime: "09:30",
                capacity: 12,
                reserved: 4
            },
            {
                id: 202,
                round: 2,
                startTime: "09:40",
                endTime: "10:10",
                capacity: 12,
                reserved: 8
            },
            {
                id: 203,
                round: 3,
                startTime: "10:20",
                endTime: "10:50",
                capacity: 12,
                reserved: 12
            }
        ]
    },
    {
        id: 3,
        name: "기타 코드 배우기",
        description: "기타의 기본 코드와 간단한 연주 방법을 배워 보는 체험입니다.",
        location: "음악실",
        sessions: [
            {
                id: 301,
                round: 1,
                startTime: "09:00",
                endTime: "09:30",
                capacity: 8,
                reserved: 2
            },
            {
                id: 302,
                round: 2,
                startTime: "09:40",
                endTime: "10:10",
                capacity: 8,
                reserved: 7
            },
            {
                id: 303,
                round: 3,
                startTime: "10:20",
                endTime: "10:50",
                capacity: 8,
                reserved: 5
            }
        ]
    },
    {
        id: 4,
        name: "미니 과학 실험",
        description: "간단한 재료를 이용해 직접 과학 실험을 진행해 보는 체험입니다.",
        location: "과학실 2",
        sessions: [
            {
                id: 401,
                round: 1,
                startTime: "09:00",
                endTime: "09:30",
                capacity: 15,
                reserved: 10
            },
            {
                id: 402,
                round: 2,
                startTime: "09:40",
                endTime: "10:10",
                capacity: 15,
                reserved: 15
            },
            {
                id: 403,
                round: 3,
                startTime: "10:20",
                endTime: "10:50",
                capacity: 15,
                reserved: 3
            }
        ]
    },
    {
        id: 5,
        name: "캐릭터 일러스트 그리기",
        description: "태블릿을 이용해 간단한 캐릭터 일러스트를 그려 보는 체험입니다.",
        location: "미술실",
        sessions: [
            {
                id: 501,
                round: 1,
                startTime: "09:00",
                endTime: "09:30",
                capacity: 10,
                reserved: 8
            },
            {
                id: 502,
                round: 2,
                startTime: "09:40",
                endTime: "10:10",
                capacity: 10,
                reserved: 5
            },
            {
                id: 503,
                round: 3,
                startTime: "10:20",
                endTime: "10:50",
                capacity: 10,
                reserved: 10
            }
        ]
    }
];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09ayta2._.js.map