import { Fragment as e, Teleport as t, computed as n, createBlock as r, createCommentVNode as i, createElementBlock as a, createElementVNode as o, createTextVNode as s, createVNode as c, nextTick as l, normalizeClass as u, normalizeStyle as d, onBeforeUnmount as ee, onMounted as te, openBlock as f, ref as p, renderList as m, resolveDynamicComponent as h, toDisplayString as g, unref as _, watch as v, withModifiers as y } from "vue";
//#region src/utils/date.js
var b = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
], x = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
], S = [
	"S",
	"M",
	"T",
	"W",
	"T",
	"F",
	"S"
], C = (e) => String(e).padStart(2, "0"), w = (e) => `${e.getFullYear()}-${C(e.getMonth() + 1)}-${C(e.getDate())}`, T = (e, t) => !!(e && t) && w(e) === w(t), E = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()), D = (e) => {
	let t = E(e);
	return t.setDate(t.getDate() - t.getDay()), t;
}, O = (e) => new Date(e.getFullYear(), e.getMonth(), 1), k = (e) => new Date(e.getFullYear(), e.getMonth() + 1, 0), A = (e) => new Date(e.getFullYear(), 0, 1), j = (e) => new Date(e.getFullYear(), 11, 31), M = (e, t) => new Date(e.getFullYear(), e.getMonth() + t, 1), N = (e, t) => new Date(e.getFullYear() + t, e.getMonth(), e.getDate()), P = (e, t) => {
	let n = E(e);
	return n.setDate(n.getDate() + t), n;
};
function F(e, t = "mm/dd/yyyy") {
	if (!e) return "";
	let n = C(e.getMonth() + 1), r = C(e.getDate()), i = e.getFullYear();
	return t === "dd/mm/yyyy" ? `${r}/${n}/${i}` : `${n}/${r}/${i}`;
}
function ne(e, t = "mm/dd/yyyy") {
	if (!e) return null;
	let n = e.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
	if (!n) return null;
	let r = +n[1], i = +n[2], a = +n[3];
	a < 100 && (a += 2e3);
	let [o, s] = t === "dd/mm/yyyy" ? [i, r] : [r, i];
	if (o < 1 || o > 12 || s < 1 || s > 31) return null;
	let c = new Date(a, o - 1, s);
	return c.getMonth() === o - 1 ? c : null;
}
function I(e) {
	let t = D(O(e)), n = [];
	for (let e = 0; e < 42; e++) n.push(P(t, e));
	return n;
}
function re(e) {
	let t = E(/* @__PURE__ */ new Date());
	if (e === "range") {
		let e = P(t, -1), n = N(t, -1);
		return [
			{
				id: "today",
				label: "Today",
				range: [t, t]
			},
			{
				id: "yesterday",
				label: "Yesterday",
				range: [e, e]
			},
			{
				id: "last7",
				label: "Last 7 days",
				range: [P(t, -6), t]
			},
			{
				id: "thismonth",
				label: "This month",
				range: [O(t), k(t)]
			},
			{
				id: "lastmonth",
				label: "Last month",
				range: [O(M(t, -1)), k(M(t, -1))]
			},
			{
				id: "thisyear",
				label: "This year",
				range: [A(t), j(t)]
			},
			{
				id: "lastyear",
				label: "Last year",
				range: [A(n), j(n)]
			}
		];
	}
	return [{
		id: "today",
		label: "Today",
		date: t
	}, {
		id: "yesterday",
		label: "Yesterday",
		date: P(t, -1)
	}];
}
//#endregion
//#region src/MonthCalendar.vue
var L = { class: "mc" }, R = { class: "mc__head" }, z = { class: "mc__selectors" }, B = {
	width: "9",
	height: "9",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { transform: "rotate(-90deg)" }
}, V = {
	width: "9",
	height: "9",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { transform: "rotate(-90deg)" }
}, H = {
	key: 0,
	class: "mc__pop"
}, ie = ["onClick"], U = {
	key: 1,
	class: "mc__pop mc__pop--year"
}, W = ["onClick"], G = {
	width: "12",
	height: "12",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { transform: "rotate(180deg)" }
}, ae = { class: "mc__dow" }, K = { class: "mc__grid" }, q = ["onClick", "onMouseenter"], oe = {
	__name: "MonthCalendar",
	props: {
		viewDate: {
			type: Date,
			required: !0
		},
		mode: {
			type: String,
			default: "single"
		},
		value: {
			type: Date,
			default: null
		},
		range: {
			type: Array,
			default: () => [null, null]
		},
		hoverDate: {
			type: Date,
			default: null
		}
	},
	emits: [
		"update:viewDate",
		"update:hoverDate",
		"pick"
	],
	setup(t, { emit: r }) {
		let c = t, l = r, d = p(null), ee = E(/* @__PURE__ */ new Date()), te = n(() => I(c.viewDate)), h = n(() => {
			let e = c.viewDate.getFullYear();
			return Array.from({ length: 21 }, (t, n) => e - 10 + n);
		});
		function v(e) {
			if (c.mode !== "range" || !c.range[0]) return !1;
			let t = c.range[0], n = c.range[1] || c.hoverDate;
			if (!n) return !1;
			let r = t < n ? t : n, i = t < n ? n : t;
			return e >= E(r) && e <= E(i);
		}
		function y(e) {
			l("update:viewDate", e);
		}
		function C(e) {
			y(new Date(c.viewDate.getFullYear(), e, 1)), d.value = null;
		}
		function w(e) {
			y(new Date(e, c.viewDate.getMonth(), 1)), d.value = null;
		}
		function D(e) {
			let t = e.getMonth() === c.viewDate.getMonth(), n = T(e, ee), r = c.mode === "single" ? T(e, c.value) : T(e, c.range[0]) || T(e, c.range[1]), i = c.mode === "range" && T(e, c.range[0]), a = c.mode === "range" && (T(e, c.range[1]) || !c.range[1] && T(e, c.hoverDate));
			return {
				"is-out": !t,
				"is-today": n,
				"is-sel": r,
				"is-start": i,
				"is-end": a,
				"is-in-range": v(e)
			};
		}
		return (n, r) => (f(), a("div", L, [
			o("div", R, [
				o("button", {
					class: "mc__nav",
					onClick: r[0] ||= (e) => y(_(M)(t.viewDate, -1)),
					"aria-label": "Previous month"
				}, [...r[4] ||= [o("svg", {
					width: "12",
					height: "12",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.6",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [o("path", { d: "M10 12L6 8L10 4" })], -1)]]),
				o("div", z, [
					o("button", {
						class: "mc__sel",
						onClick: r[1] ||= (e) => d.value = d.value === "m" ? null : "m"
					}, [s(g(_(b)[t.viewDate.getMonth()]) + " ", 1), (f(), a("svg", B, [...r[5] ||= [o("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))]),
					o("button", {
						class: "mc__sel mc__sel--year",
						onClick: r[2] ||= (e) => d.value = d.value === "y" ? null : "y"
					}, [s(g(t.viewDate.getFullYear()) + " ", 1), (f(), a("svg", V, [...r[6] ||= [o("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))]),
					d.value === "m" ? (f(), a("div", H, [(f(!0), a(e, null, m(_(x), (e, n) => (f(), a("button", {
						key: e,
						class: u(["mc__popItem", { "is-active": n === t.viewDate.getMonth() }]),
						onClick: (e) => C(n)
					}, g(e), 11, ie))), 128))])) : d.value === "y" ? (f(), a("div", U, [(f(!0), a(e, null, m(h.value, (e) => (f(), a("button", {
						key: e,
						class: u(["mc__popItem", { "is-active": e === t.viewDate.getFullYear() }]),
						onClick: (t) => w(e)
					}, g(e), 11, W))), 128))])) : i("", !0)
				]),
				o("button", {
					class: "mc__nav",
					onClick: r[3] ||= (e) => y(_(M)(t.viewDate, 1)),
					"aria-label": "Next month"
				}, [(f(), a("svg", G, [...r[7] ||= [o("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))])
			]),
			o("div", ae, [(f(!0), a(e, null, m(_(S), (e, t) => (f(), a("div", {
				key: t,
				class: "mc__dowCell"
			}, g(e), 1))), 128))]),
			o("div", K, [(f(!0), a(e, null, m(te.value, (e, t) => (f(), a("button", {
				key: t,
				class: u(["mc__cell", D(e)]),
				onClick: (t) => l("pick", e),
				onMouseenter: (t) => l("update:hoverDate", e)
			}, [o("span", null, g(e.getDate()), 1)], 42, q))), 128))])
		]));
	}
}, se = {
	key: 0,
	class: "dp__label"
}, ce = {
	key: 0,
	class: "dp__outline",
	"aria-hidden": "true"
}, le = { class: "dp__outlineNotch" }, ue = {
	key: 3,
	width: "14",
	height: "14",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round"
}, de = ["value", "placeholder"], fe = {
	key: 0,
	class: "dp__outline",
	"aria-hidden": "true"
}, pe = { class: "dp__outlineNotch" }, me = {
	key: 3,
	width: "14",
	height: "14",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round"
}, he = ["value", "placeholder"], ge = ["value", "placeholder"], _e = {
	key: 0,
	class: "dp__scCol"
}, ve = ["onClick"], ye = { class: "dp__panelBody" }, be = {
	key: 0,
	class: "dp__scRow"
}, xe = ["onClick"], J = 6, Y = 8, X = {
	__name: "DateInput",
	props: {
		mode: {
			type: String,
			default: "single"
		},
		modelValue: {
			type: [
				String,
				Date,
				Array,
				null
			],
			default: null
		},
		label: {
			type: String,
			default: "Date"
		},
		icon: {
			type: [Object, Function],
			default: null
		},
		bgColor: {
			type: String,
			default: null
		},
		clearable: {
			type: Boolean,
			default: !1
		},
		format: {
			type: String,
			default: "dd/mm/yyyy"
		},
		theme: {
			type: String,
			default: "dark"
		},
		placeholder: {
			type: String,
			default: ""
		},
		defaultOpen: {
			type: Boolean,
			default: !1
		},
		variant: {
			type: String,
			default: "normal"
		},
		hideDetails: {
			type: [Boolean, String],
			default: !1
		},
		messages: {
			type: [String, Array],
			default: null
		},
		hint: {
			type: String,
			default: null
		}
	},
	emits: ["update:modelValue", "change"],
	setup(s, { emit: _ }) {
		function b(e) {
			if (!e) return null;
			if (e instanceof Date) return isNaN(e) ? null : e;
			if (typeof e == "string") {
				let t = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
				if (t) return new Date(+t[1], t[2] - 1, +t[3]);
			}
			return null;
		}
		let x = s, S = _, C = p(x.defaultOpen), E = p(!1), D = p(null), k = p(null), A = p(x.mode === "single" ? b(x.modelValue) : null), j = p(x.mode === "range" && Array.isArray(x.modelValue) && x.modelValue.length === 2 ? [b(x.modelValue[0]), b(x.modelValue[1])] : [null, null]), M = p(null), N = p(O(A.value || j.value && j.value[0] || /* @__PURE__ */ new Date())), P = p(A.value ? F(A.value, x.format) : ""), I = p(j.value[0] ? F(j.value[0], x.format) : ""), L = p(j.value[1] ? F(j.value[1], x.format) : ""), R = p("start"), z = n(() => x.placeholder || x.format), B = n(() => re(x.mode)), V = n(() => x.variant === "normal" ? !1 : x.mode === "single" ? C.value || !!A.value || !!P.value : C.value || !!j.value[0] || !!j.value[1] || !!I.value || !!L.value), H = n(() => E.value ? [`Couldn't read that date. Try ${x.format}.`] : x.messages ? Array.isArray(x.messages) ? x.messages : [x.messages] : x.hint ? [x.hint] : []), ie = n(() => x.hideDetails === !0 ? !1 : x.hideDetails === "auto" ? H.value.length > 0 : !0);
		v(() => x.modelValue, (e) => {
			if (x.mode === "single") {
				let t = b(e);
				A.value = t, P.value = t ? F(t, x.format) : "", t && (N.value = O(t));
			} else if (Array.isArray(e)) {
				let t = b(e[0]), n = b(e[1]);
				j.value = [t, n], I.value = t ? F(t, x.format) : "", L.value = n ? F(n, x.format) : "", t && (N.value = O(t));
			}
			U.value = JSON.stringify(x.mode === "single" ? A.value ? w(A.value) : null : [j.value[0] ? w(j.value[0]) : null, j.value[1] ? w(j.value[1]) : null]);
		});
		let U = p(JSON.stringify(x.mode === "single" ? A.value ? w(A.value) : null : [j.value[0] ? w(j.value[0]) : null, j.value[1] ? w(j.value[1]) : null]));
		function W() {
			let e;
			if (x.mode === "single") e = A.value ? w(A.value) : null;
			else {
				let [t, n] = j.value;
				if (t && !n || !t && n) return;
				e = [t ? w(t) : null, n ? w(n) : null];
			}
			let t = JSON.stringify(e);
			t !== U.value && (U.value = t, S("update:modelValue", e), S("change", e));
		}
		let G = p({
			top: 0,
			left: 0
		}), ae = n(() => ({
			top: `${G.value.top}px`,
			left: `${G.value.left}px`
		}));
		function K() {
			let e = D.value, t = k.value;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = t.offsetWidth, i = t.offsetHeight, a = document.documentElement.clientWidth, o = document.documentElement.clientHeight, s = o - n.bottom - J - Y, c = n.top - J - Y, l = i > s && c > s ? n.top - J - i : n.bottom + J, u = getComputedStyle(e).direction === "rtl" ? n.right - r : n.left;
			G.value = {
				top: Math.max(Y, Math.min(l, o - i - Y)),
				left: Math.max(Y, Math.min(u, a - r - Y))
			};
		}
		let q = 0;
		function X() {
			q ||= requestAnimationFrame(() => {
				q = 0, K();
			});
		}
		let Z = null;
		async function Q() {
			await l(), K(), window.addEventListener("scroll", X, !0), window.addEventListener("resize", X), typeof ResizeObserver < "u" && k.value && (Z = new ResizeObserver(X), Z.observe(k.value));
		}
		function Se() {
			window.removeEventListener("scroll", X, !0), window.removeEventListener("resize", X), Z?.disconnect(), Z = null, q && cancelAnimationFrame(q), q = 0;
		}
		v(C, (e) => e ? Q() : Se());
		function Ce(e) {
			C.value && (D.value?.contains(e.target) || k.value?.contains(e.target) || (C.value = !1));
		}
		te(() => {
			document.addEventListener("mousedown", Ce), C.value && Q();
		}), ee(() => {
			document.removeEventListener("mousedown", Ce), Se();
		});
		function we(e) {
			if (E.value = !1, x.mode === "single") A.value = e, P.value = F(e, x.format), N.value = O(e), W(), C.value = !1;
			else {
				let [t, n] = j.value;
				if (!t || t && n) j.value = [e, null], I.value = F(e, x.format), L.value = "", R.value = "end";
				else {
					let n = e < t ? [e, t] : [t, e];
					j.value = n, I.value = F(n[0], x.format), L.value = F(n[1], x.format), R.value = "start", C.value = !1;
				}
				W();
			}
		}
		function Te(e) {
			E.value = !1, x.mode === "single" ? (A.value = e.date, P.value = F(e.date, x.format), N.value = O(e.date), W(), C.value = !1) : (j.value = [...e.range], I.value = F(e.range[0], x.format), L.value = F(e.range[1], x.format), N.value = O(e.range[0]), W(), C.value = !1);
		}
		function Ee(e) {
			return x.mode === "single" ? A.value && T(A.value, e.date) : j.value[0] && j.value[1] && T(j.value[0], e.range[0]) && T(j.value[1], e.range[1]);
		}
		function De() {
			if (P.value === "") {
				A.value = null, E.value = !1, W();
				return;
			}
			let e = ne(P.value, x.format);
			e ? (A.value = e, N.value = O(e), E.value = !1, W()) : E.value = !0;
		}
		function Oe(e) {
			let t = e === "start" ? I.value : L.value, n = e === "start" ? 0 : 1;
			if (t === "") {
				let e = [...j.value];
				e[n] = null, j.value = e, E.value = !1, W();
				return;
			}
			let r = ne(t, x.format);
			if (!r) {
				E.value = !0;
				return;
			}
			let i = [...j.value];
			i[n] = r, i[0] && i[1] && i[1] < i[0] && (i = [i[1], i[0]]), j.value = i, I.value = i[0] ? F(i[0], x.format) : "", L.value = i[1] ? F(i[1], x.format) : "", i[n] && (N.value = O(i[n])), E.value = !1, W();
		}
		function ke(e, t, n) {
			if (t.length <= e.length) return t;
			let r = t.split("/"), i = r.length - 1;
			if (i >= 2) return t;
			let a = r[i], o = n === "dd/mm/yyyy" && i === 1 || n === "mm/dd/yyyy" && i === 0, s = n === "dd/mm/yyyy" && i === 0 || n === "mm/dd/yyyy" && i === 1;
			if (a.length === 2 && /^\d{2}$/.test(a)) return r.slice(0, i).concat([a]).join("/") + "/";
			if (a.length === 1 && /^\d$/.test(a)) {
				let e = +a;
				if (o && e >= 2 || s && e >= 4) return r.slice(0, i).concat(["0" + a]).join("/") + "/";
			}
			return t;
		}
		function Ae(e) {
			E.value = !1;
			let t = P.value, n = e.target.value, r = ke(t, n, x.format);
			r === n ? P.value = n : (e.target.value = r, P.value = r);
		}
		function je(e, t) {
			E.value = !1;
			let n = e === "start" ? I : L, r = n.value, i = t.target.value, a = ke(r, i, x.format);
			a === i ? n.value = i : (t.target.value = a, n.value = a);
		}
		function $() {
			A.value = null, j.value = [null, null], P.value = "", I.value = "", L.value = "", E.value = !1, W();
		}
		return (n, l) => (f(), a("div", {
			class: u([
				"dp",
				`dp--${s.theme}`,
				`dp--variant-${s.variant}`,
				{ [`dp--mode-${s.mode}`]: !0 }
			]),
			ref_key: "wrapRef",
			ref: D
		}, [
			s.variant === "normal" ? (f(), a("label", se, g(s.label), 1)) : i("", !0),
			s.mode === "single" ? (f(), a("div", {
				key: 1,
				class: u(["dp__field", {
					"is-error": E.value,
					"is-open": C.value,
					"is-floated": V.value
				}]),
				style: d(s.bgColor ? { background: s.bgColor } : void 0)
			}, [
				s.variant === "outlined" ? (f(), a("div", ce, [
					l[9] ||= o("div", { class: "dp__outlineStart" }, null, -1),
					o("div", le, [o("span", null, g(s.label), 1)]),
					l[10] ||= o("div", { class: "dp__outlineEnd" }, null, -1)
				])) : i("", !0),
				s.variant === "normal" ? i("", !0) : (f(), a("label", {
					key: 1,
					class: u(["dp__label", {
						"is-floated": V.value,
						"is-active": C.value
					}])
				}, g(s.label), 3)),
				s.icon ? (f(), r(h(s.icon), {
					key: 2,
					class: "dp__icon"
				})) : (f(), a("svg", ue, [...l[11] ||= [o("rect", {
					x: "2.25",
					y: "3.25",
					width: "11.5",
					height: "10.5",
					rx: "1.5"
				}, null, -1), o("path", { d: "M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" }, null, -1)]])),
				o("input", {
					value: P.value,
					class: "dp__input",
					placeholder: s.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: l[0] ||= (e) => C.value = !0,
					onBlur: De,
					onInput: Ae
				}, null, 40, de),
				s.clearable && (A.value || P.value) ? (f(), a("button", {
					key: 4,
					class: "dp__clear",
					onMousedown: y($, ["prevent"]),
					"aria-label": "Clear"
				}, "×", 32)) : i("", !0)
			], 6)) : (f(), a("div", {
				key: 2,
				class: u(["dp__field dp__field--range", {
					"is-error": E.value,
					"is-open": C.value,
					"is-floated": V.value
				}]),
				style: d(s.bgColor ? { background: s.bgColor } : void 0)
			}, [
				s.variant === "outlined" ? (f(), a("div", fe, [
					l[12] ||= o("div", { class: "dp__outlineStart" }, null, -1),
					o("div", pe, [o("span", null, g(s.label), 1)]),
					l[13] ||= o("div", { class: "dp__outlineEnd" }, null, -1)
				])) : i("", !0),
				s.variant === "normal" ? i("", !0) : (f(), a("label", {
					key: 1,
					class: u(["dp__label", {
						"is-floated": V.value,
						"is-active": C.value
					}])
				}, g(s.label), 3)),
				s.icon ? (f(), r(h(s.icon), {
					key: 2,
					class: "dp__icon"
				})) : (f(), a("svg", me, [...l[14] ||= [o("rect", {
					x: "2.25",
					y: "3.25",
					width: "11.5",
					height: "10.5",
					rx: "1.5"
				}, null, -1), o("path", { d: "M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" }, null, -1)]])),
				o("input", {
					value: I.value,
					class: u(["dp__input", { "is-focus": R.value === "start" && C.value }]),
					placeholder: s.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: l[1] ||= (e) => {
						C.value = !0, R.value = "start";
					},
					onBlur: l[2] ||= (e) => Oe("start"),
					onInput: l[3] ||= (e) => je("start", e)
				}, null, 42, he),
				l[15] ||= o("span", { class: "dp__sep" }, "→", -1),
				o("input", {
					value: L.value,
					class: u(["dp__input", { "is-focus": R.value === "end" && C.value }]),
					placeholder: s.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: l[4] ||= (e) => {
						C.value = !0, R.value = "end";
					},
					onBlur: l[5] ||= (e) => Oe("end"),
					onInput: l[6] ||= (e) => je("end", e)
				}, null, 42, ge),
				s.clearable && (j.value[0] || j.value[1] || I.value || L.value) ? (f(), a("button", {
					key: 4,
					class: "dp__clear",
					onMousedown: y($, ["prevent"]),
					"aria-label": "Clear"
				}, "×", 32)) : i("", !0)
			], 6)),
			ie.value ? (f(), a("div", {
				key: 3,
				class: u(["dp__details", {
					"is-error": E.value,
					"is-hint": !E.value && H.value.length
				}])
			}, [(f(!0), a(e, null, m(H.value, (e, t) => (f(), a("span", { key: t }, g(e), 1))), 128))], 2)) : i("", !0),
			(f(), r(t, { to: "body" }, [C.value ? (f(), a("div", {
				key: 0,
				ref_key: "panelRef",
				ref: k,
				class: u([
					"dp",
					"dp--portal",
					`dp--${s.theme}`,
					`dp--variant-${s.variant}`,
					{ [`dp--mode-${s.mode}`]: !0 }
				]),
				style: d(ae.value)
			}, [o("div", { class: u(["dp__panel", { "dp__panel--range": s.mode === "range" }]) }, [s.mode === "range" ? (f(), a("div", _e, [(f(!0), a(e, null, m(B.value, (e) => (f(), a("button", {
				key: e.id,
				class: u(["dp__scChip", { "is-active": Ee(e) }]),
				onClick: (t) => Te(e)
			}, g(e.label), 11, ve))), 128))])) : i("", !0), o("div", ye, [c(oe, {
				"view-date": N.value,
				mode: s.mode,
				value: A.value,
				range: j.value,
				"hover-date": M.value,
				"onUpdate:viewDate": l[7] ||= (e) => N.value = e,
				"onUpdate:hoverDate": l[8] ||= (e) => M.value = e,
				onPick: we
			}, null, 8, [
				"view-date",
				"mode",
				"value",
				"range",
				"hover-date"
			]), s.mode === "range" ? i("", !0) : (f(), a("div", be, [(f(!0), a(e, null, m(B.value, (e) => (f(), a("button", {
				key: e.id,
				class: u(["dp__scChip", { "is-active": Ee(e) }]),
				onClick: (t) => Te(e)
			}, g(e.label), 11, xe))), 128))]))])], 2)], 6)) : i("", !0)]))
		], 2));
	}
};
//#endregion
//#region src/index.js
X.install = (e) => {
	e.component("DateInput", X);
};
var Z = X;
//#endregion
export { X as DateInput, Z as default };
