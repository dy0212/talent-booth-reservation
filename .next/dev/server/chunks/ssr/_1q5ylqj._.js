module.exports = [
"[project]/app/schedule/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SchedulePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$reservation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/reservation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SchedulePage() {
    const [reservations, setReservations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setReservations((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$reservation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getReservations"])());
    }, []);
    function handleCancel(reservationId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$reservation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelReservation"])(reservationId);
        setReservations((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$reservation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getReservations"])());
    }
    const sortedReservations = [
        ...reservations
    ].sort((a, b)=>a.startTime.localeCompare(b.startTime));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "back-link",
                children: "← 부스 목록"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: "schedule-page",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("h1", {
                        children: "내 시간표"
                    }),
                    sortedReservations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("p", {
                        children: "예약한 부스가 없습니다."
                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: "reservation-list",
                        children: sortedReservations.map((reservation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                                className: "reservation-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("h2", {
                                                children: reservation.boothName
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("p", {
                                                children: [
                                                    reservation.round,
                                                    "회차"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("p", {
                                                children: [
                                                    reservation.startTime,
                                                    " ~ ",
                                                    reservation.endTime
                                                ]
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("p", {
                                                children: [
                                                    "장소: ",
                                                    reservation.location
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("button", {
                                        className: "cancel-button",
                                        onClick: ()=>handleCancel(reservation.id),
                                        children: "예약 취소"
                                    })
                                ]
                            }, reservation.id))
                    })
                ]
            })
        ]
    });
}
}),
"[project]/utils/reservation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addReservation",
    ()=>addReservation,
    "cancelReservation",
    ()=>cancelReservation,
    "getLocalReservedCount",
    ()=>getLocalReservedCount,
    "getReservations",
    ()=>getReservations
]);
const STORAGE_KEY = "talent-booth-reservations";
function getReservations() {
    if ("TURBOPACK compile-time truthy", 1) {
        return [];
    }
    //TURBOPACK unreachable
    ;
    const saved = undefined;
}
function saveReservations(reservations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}
function isTimeOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}
function addReservation(booth, session) {
    const reservations = getReservations();
    const alreadyReserved = reservations.some((reservation)=>reservation.sessionId === session.id);
    if (alreadyReserved) {
        return {
            success: false,
            message: "이미 예약한 회차입니다."
        };
    }
    // 시간 중복 검사
    const timeConflict = reservations.some((reservation)=>isTimeOverlap(session.startTime, session.endTime, reservation.startTime, reservation.endTime));
    if (timeConflict) {
        return {
            success: false,
            message: "이미 예약한 다른 부스와 시간이 겹칩니다."
        };
    }
    const localReservedCount = reservations.filter((reservation)=>reservation.sessionId === session.id).length;
    const remaining = session.capacity - session.reserved - localReservedCount;
    if (remaining <= 0) {
        return {
            success: false,
            message: "해당 회차의 정원이 모두 찼습니다."
        };
    }
    const newReservation = {
        id: Date.now(),
        boothId: booth.id,
        boothName: booth.name,
        location: booth.location,
        sessionId: session.id,
        round: session.round,
        startTime: session.startTime,
        endTime: session.endTime
    };
    const updatedReservations = [
        ...reservations,
        newReservation
    ];
    saveReservations(updatedReservations);
    return {
        success: true,
        message: "예약되었습니다.",
        reservation: newReservation
    };
}
function cancelReservation(reservationId) {
    const reservations = getReservations();
    const updatedReservations = reservations.filter((reservation)=>reservation.id !== reservationId);
    saveReservations(updatedReservations);
}
function getLocalReservedCount(sessionId) {
    const reservations = getReservations();
    return reservations.filter((reservation)=>reservation.sessionId === sessionId).length;
}
}),
];

//# sourceMappingURL=_1q5ylqj._.js.map