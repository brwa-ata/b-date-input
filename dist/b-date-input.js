import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, createVNode as s, normalizeClass as c, normalizeStyle as l, onBeforeUnmount as u, onMounted as d, openBlock as f, ref as p, renderList as m, resolveDynamicComponent as h, toDisplayString as g, unref as _, watch as v, withModifiers as y } from "vue";
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
function I(e, t = "mm/dd/yyyy") {
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
function L(e) {
	let t = D(O(e)), n = [];
	for (let e = 0; e < 42; e++) n.push(P(t, e));
	return n;
}
function ee(e) {
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
var R = { class: "mc" }, z = { class: "mc__head" }, B = { class: "mc__selectors" }, V = {
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
	width: "9",
	height: "9",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { transform: "rotate(-90deg)" }
}, U = {
	key: 0,
	class: "mc__pop"
}, W = ["onClick"], G = {
	key: 1,
	class: "mc__pop mc__pop--year"
}, K = ["onClick"], q = {
	width: "12",
	height: "12",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { transform: "rotate(180deg)" }
}, J = { class: "mc__dow" }, Y = { class: "mc__grid" }, X = ["onClick", "onMouseenter"], te = {
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
	setup(n, { emit: s }) {
		let l = n, u = s, d = p(null), h = E(/* @__PURE__ */ new Date()), v = t(() => L(l.viewDate)), y = t(() => {
			let e = l.viewDate.getFullYear();
			return Array.from({ length: 21 }, (t, n) => e - 10 + n);
		});
		function C(e) {
			if (l.mode !== "range" || !l.range[0]) return !1;
			let t = l.range[0], n = l.range[1] || l.hoverDate;
			if (!n) return !1;
			let r = t < n ? t : n, i = t < n ? n : t;
			return e >= E(r) && e <= E(i);
		}
		function w(e) {
			u("update:viewDate", e);
		}
		function D(e) {
			w(new Date(l.viewDate.getFullYear(), e, 1)), d.value = null;
		}
		function O(e) {
			w(new Date(e, l.viewDate.getMonth(), 1)), d.value = null;
		}
		function k(e) {
			let t = e.getMonth() === l.viewDate.getMonth(), n = T(e, h), r = l.mode === "single" ? T(e, l.value) : T(e, l.range[0]) || T(e, l.range[1]), i = l.mode === "range" && T(e, l.range[0]), a = l.mode === "range" && (T(e, l.range[1]) || !l.range[1] && T(e, l.hoverDate));
			return {
				"is-out": !t,
				"is-today": n,
				"is-sel": r,
				"is-start": i,
				"is-end": a,
				"is-in-range": C(e)
			};
		}
		return (t, s) => (f(), i("div", R, [
			a("div", z, [
				a("button", {
					class: "mc__nav",
					onClick: s[0] ||= (e) => w(_(M)(n.viewDate, -1)),
					"aria-label": "Previous month"
				}, [...s[4] ||= [a("svg", {
					width: "12",
					height: "12",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.6",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [a("path", { d: "M10 12L6 8L10 4" })], -1)]]),
				a("div", B, [
					a("button", {
						class: "mc__sel",
						onClick: s[1] ||= (e) => d.value = d.value === "m" ? null : "m"
					}, [o(g(_(b)[n.viewDate.getMonth()]) + " ", 1), (f(), i("svg", V, [...s[5] ||= [a("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))]),
					a("button", {
						class: "mc__sel mc__sel--year",
						onClick: s[2] ||= (e) => d.value = d.value === "y" ? null : "y"
					}, [o(g(n.viewDate.getFullYear()) + " ", 1), (f(), i("svg", H, [...s[6] ||= [a("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))]),
					d.value === "m" ? (f(), i("div", U, [(f(!0), i(e, null, m(_(x), (e, t) => (f(), i("button", {
						key: e,
						class: c(["mc__popItem", { "is-active": t === n.viewDate.getMonth() }]),
						onClick: (e) => D(t)
					}, g(e), 11, W))), 128))])) : d.value === "y" ? (f(), i("div", G, [(f(!0), i(e, null, m(y.value, (e) => (f(), i("button", {
						key: e,
						class: c(["mc__popItem", { "is-active": e === n.viewDate.getFullYear() }]),
						onClick: (t) => O(e)
					}, g(e), 11, K))), 128))])) : r("", !0)
				]),
				a("button", {
					class: "mc__nav",
					onClick: s[3] ||= (e) => w(_(M)(n.viewDate, 1)),
					"aria-label": "Next month"
				}, [(f(), i("svg", q, [...s[7] ||= [a("path", { d: "M10 12L6 8L10 4" }, null, -1)]]))])
			]),
			a("div", J, [(f(!0), i(e, null, m(_(S), (e, t) => (f(), i("div", {
				key: t,
				class: "mc__dowCell"
			}, g(e), 1))), 128))]),
			a("div", Y, [(f(!0), i(e, null, m(v.value, (e, t) => (f(), i("button", {
				key: t,
				class: c(["mc__cell", k(e)]),
				onClick: (t) => u("pick", e),
				onMouseenter: (t) => u("update:hoverDate", e)
			}, [a("span", null, g(e.getDate()), 1)], 42, X))), 128))])
		]));
	}
}, ne = {
	key: 0,
	class: "dp__label"
}, re = {
	key: 0,
	class: "dp__outline",
	"aria-hidden": "true"
}, ie = { class: "dp__outlineNotch" }, ae = {
	key: 3,
	width: "14",
	height: "14",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round"
}, oe = ["value", "placeholder"], se = {
	key: 0,
	class: "dp__outline",
	"aria-hidden": "true"
}, ce = { class: "dp__outlineNotch" }, le = {
	key: 3,
	width: "14",
	height: "14",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round"
}, ue = ["value", "placeholder"], de = ["value", "placeholder"], fe = {
	key: 0,
	class: "dp__scCol"
}, pe = ["onClick"], me = { class: "dp__panelBody" }, he = {
	key: 0,
	class: "dp__scRow"
}, ge = ["onClick"], Z = {
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
	setup(o, { emit: _ }) {
		function b(e) {
			if (!e) return null;
			if (e instanceof Date) return isNaN(e) ? null : e;
			if (typeof e == "string") {
				let t = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
				if (t) return new Date(+t[1], t[2] - 1, +t[3]);
			}
			return null;
		}
		let x = o, S = _, C = p(x.defaultOpen), E = p(!1), D = p(null), k = p(x.mode === "single" ? b(x.modelValue) : null), A = p(x.mode === "range" && Array.isArray(x.modelValue) && x.modelValue.length === 2 ? [b(x.modelValue[0]), b(x.modelValue[1])] : [null, null]), j = p(null), M = p(O(k.value || A.value && A.value[0] || /* @__PURE__ */ new Date())), N = p(k.value ? F(k.value, x.format) : ""), P = p(A.value[0] ? F(A.value[0], x.format) : ""), L = p(A.value[1] ? F(A.value[1], x.format) : ""), R = p("start"), z = t(() => x.placeholder || x.format), B = t(() => ee(x.mode)), V = t(() => x.variant === "normal" ? !1 : x.mode === "single" ? C.value || !!k.value || !!N.value : C.value || !!A.value[0] || !!A.value[1] || !!P.value || !!L.value), H = t(() => E.value ? [`Couldn't read that date. Try ${x.format}.`] : x.messages ? Array.isArray(x.messages) ? x.messages : [x.messages] : x.hint ? [x.hint] : []), U = t(() => x.hideDetails === !0 ? !1 : x.hideDetails === "auto" ? H.value.length > 0 : !0);
		v(() => x.modelValue, (e) => {
			if (x.mode === "single") {
				let t = b(e);
				k.value = t, N.value = t ? F(t, x.format) : "", t && (M.value = O(t));
			} else if (Array.isArray(e)) {
				let t = b(e[0]), n = b(e[1]);
				A.value = [t, n], P.value = t ? F(t, x.format) : "", L.value = n ? F(n, x.format) : "", t && (M.value = O(t));
			}
			W.value = JSON.stringify(x.mode === "single" ? k.value ? w(k.value) : null : [A.value[0] ? w(A.value[0]) : null, A.value[1] ? w(A.value[1]) : null]);
		});
		let W = p(JSON.stringify(x.mode === "single" ? k.value ? w(k.value) : null : [A.value[0] ? w(A.value[0]) : null, A.value[1] ? w(A.value[1]) : null]));
		function G() {
			let e;
			if (x.mode === "single") e = k.value ? w(k.value) : null;
			else {
				let [t, n] = A.value;
				if (t && !n || !t && n) return;
				e = [t ? w(t) : null, n ? w(n) : null];
			}
			let t = JSON.stringify(e);
			t !== W.value && (W.value = t, S("update:modelValue", e), S("change", e));
		}
		function K(e) {
			D.value && !D.value.contains(e.target) && (C.value = !1);
		}
		d(() => document.addEventListener("mousedown", K)), u(() => document.removeEventListener("mousedown", K));
		function q(e) {
			if (E.value = !1, x.mode === "single") k.value = e, N.value = F(e, x.format), M.value = O(e), G(), C.value = !1;
			else {
				let [t, n] = A.value;
				if (!t || t && n) A.value = [e, null], P.value = F(e, x.format), L.value = "", R.value = "end";
				else {
					let n = e < t ? [e, t] : [t, e];
					A.value = n, P.value = F(n[0], x.format), L.value = F(n[1], x.format), R.value = "start", C.value = !1;
				}
				G();
			}
		}
		function J(e) {
			E.value = !1, x.mode === "single" ? (k.value = e.date, N.value = F(e.date, x.format), M.value = O(e.date), G(), C.value = !1) : (A.value = [...e.range], P.value = F(e.range[0], x.format), L.value = F(e.range[1], x.format), M.value = O(e.range[0]), G(), C.value = !1);
		}
		function Y(e) {
			return x.mode === "single" ? k.value && T(k.value, e.date) : A.value[0] && A.value[1] && T(A.value[0], e.range[0]) && T(A.value[1], e.range[1]);
		}
		function X() {
			if (N.value === "") {
				k.value = null, E.value = !1, G();
				return;
			}
			let e = I(N.value, x.format);
			e ? (k.value = e, M.value = O(e), E.value = !1, G()) : E.value = !0;
		}
		function Z(e) {
			let t = e === "start" ? P.value : L.value, n = e === "start" ? 0 : 1;
			if (t === "") {
				let e = [...A.value];
				e[n] = null, A.value = e, E.value = !1, G();
				return;
			}
			let r = I(t, x.format);
			if (!r) {
				E.value = !0;
				return;
			}
			let i = [...A.value];
			i[n] = r, i[0] && i[1] && i[1] < i[0] && (i = [i[1], i[0]]), A.value = i, P.value = i[0] ? F(i[0], x.format) : "", L.value = i[1] ? F(i[1], x.format) : "", i[n] && (M.value = O(i[n])), E.value = !1, G();
		}
		function Q(e, t, n) {
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
		function _e(e) {
			E.value = !1;
			let t = N.value, n = e.target.value, r = Q(t, n, x.format);
			r === n ? N.value = n : (e.target.value = r, N.value = r);
		}
		function ve(e, t) {
			E.value = !1;
			let n = e === "start" ? P : L, r = n.value, i = t.target.value, a = Q(r, i, x.format);
			a === i ? n.value = i : (t.target.value = a, n.value = a);
		}
		function $() {
			k.value = null, A.value = [null, null], N.value = "", P.value = "", L.value = "", E.value = !1, G();
		}
		return (t, u) => (f(), i("div", {
			class: c([
				"dp",
				`dp--${o.theme}`,
				`dp--variant-${o.variant}`,
				{ [`dp--mode-${o.mode}`]: !0 }
			]),
			ref_key: "wrapRef",
			ref: D
		}, [
			o.variant === "normal" ? (f(), i("label", ne, g(o.label), 1)) : r("", !0),
			o.mode === "single" ? (f(), i("div", {
				key: 1,
				class: c(["dp__field", {
					"is-error": E.value,
					"is-open": C.value,
					"is-floated": V.value
				}]),
				style: l(o.bgColor ? { background: o.bgColor } : void 0)
			}, [
				o.variant === "outlined" ? (f(), i("div", re, [
					u[9] ||= a("div", { class: "dp__outlineStart" }, null, -1),
					a("div", ie, [a("span", null, g(o.label), 1)]),
					u[10] ||= a("div", { class: "dp__outlineEnd" }, null, -1)
				])) : r("", !0),
				o.variant === "normal" ? r("", !0) : (f(), i("label", {
					key: 1,
					class: c(["dp__label", {
						"is-floated": V.value,
						"is-active": C.value
					}])
				}, g(o.label), 3)),
				o.icon ? (f(), n(h(o.icon), {
					key: 2,
					class: "dp__icon"
				})) : (f(), i("svg", ae, [...u[11] ||= [a("rect", {
					x: "2.25",
					y: "3.25",
					width: "11.5",
					height: "10.5",
					rx: "1.5"
				}, null, -1), a("path", { d: "M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" }, null, -1)]])),
				a("input", {
					value: N.value,
					class: "dp__input",
					placeholder: o.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: u[0] ||= (e) => C.value = !0,
					onBlur: X,
					onInput: _e
				}, null, 40, oe),
				o.clearable && (k.value || N.value) ? (f(), i("button", {
					key: 4,
					class: "dp__clear",
					onMousedown: y($, ["prevent"]),
					"aria-label": "Clear"
				}, "×", 32)) : r("", !0)
			], 6)) : (f(), i("div", {
				key: 2,
				class: c(["dp__field dp__field--range", {
					"is-error": E.value,
					"is-open": C.value,
					"is-floated": V.value
				}]),
				style: l(o.bgColor ? { background: o.bgColor } : void 0)
			}, [
				o.variant === "outlined" ? (f(), i("div", se, [
					u[12] ||= a("div", { class: "dp__outlineStart" }, null, -1),
					a("div", ce, [a("span", null, g(o.label), 1)]),
					u[13] ||= a("div", { class: "dp__outlineEnd" }, null, -1)
				])) : r("", !0),
				o.variant === "normal" ? r("", !0) : (f(), i("label", {
					key: 1,
					class: c(["dp__label", {
						"is-floated": V.value,
						"is-active": C.value
					}])
				}, g(o.label), 3)),
				o.icon ? (f(), n(h(o.icon), {
					key: 2,
					class: "dp__icon"
				})) : (f(), i("svg", le, [...u[14] ||= [a("rect", {
					x: "2.25",
					y: "3.25",
					width: "11.5",
					height: "10.5",
					rx: "1.5"
				}, null, -1), a("path", { d: "M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" }, null, -1)]])),
				a("input", {
					value: P.value,
					class: c(["dp__input", { "is-focus": R.value === "start" && C.value }]),
					placeholder: o.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: u[1] ||= (e) => {
						C.value = !0, R.value = "start";
					},
					onBlur: u[2] ||= (e) => Z("start"),
					onInput: u[3] ||= (e) => ve("start", e)
				}, null, 42, ue),
				u[15] ||= a("span", { class: "dp__sep" }, "→", -1),
				a("input", {
					value: L.value,
					class: c(["dp__input", { "is-focus": R.value === "end" && C.value }]),
					placeholder: o.variant !== "normal" && !V.value ? "" : z.value,
					inputmode: "numeric",
					maxlength: "10",
					onFocus: u[4] ||= (e) => {
						C.value = !0, R.value = "end";
					},
					onBlur: u[5] ||= (e) => Z("end"),
					onInput: u[6] ||= (e) => ve("end", e)
				}, null, 42, de),
				o.clearable && (A.value[0] || A.value[1] || P.value || L.value) ? (f(), i("button", {
					key: 4,
					class: "dp__clear",
					onMousedown: y($, ["prevent"]),
					"aria-label": "Clear"
				}, "×", 32)) : r("", !0)
			], 6)),
			U.value ? (f(), i("div", {
				key: 3,
				class: c(["dp__details", {
					"is-error": E.value,
					"is-hint": !E.value && H.value.length
				}])
			}, [(f(!0), i(e, null, m(H.value, (e, t) => (f(), i("span", { key: t }, g(e), 1))), 128))], 2)) : r("", !0),
			C.value ? (f(), i("div", {
				key: 4,
				class: c(["dp__panel", { "dp__panel--range": o.mode === "range" }])
			}, [o.mode === "range" ? (f(), i("div", fe, [(f(!0), i(e, null, m(B.value, (e) => (f(), i("button", {
				key: e.id,
				class: c(["dp__scChip", { "is-active": Y(e) }]),
				onClick: (t) => J(e)
			}, g(e.label), 11, pe))), 128))])) : r("", !0), a("div", me, [s(te, {
				"view-date": M.value,
				mode: o.mode,
				value: k.value,
				range: A.value,
				"hover-date": j.value,
				"onUpdate:viewDate": u[7] ||= (e) => M.value = e,
				"onUpdate:hoverDate": u[8] ||= (e) => j.value = e,
				onPick: q
			}, null, 8, [
				"view-date",
				"mode",
				"value",
				"range",
				"hover-date"
			]), o.mode === "range" ? r("", !0) : (f(), i("div", he, [(f(!0), i(e, null, m(B.value, (e) => (f(), i("button", {
				key: e.id,
				class: c(["dp__scChip", { "is-active": Y(e) }]),
				onClick: (t) => J(e)
			}, g(e.label), 11, ge))), 128))]))])], 2)) : r("", !0)
		], 2));
	}
};
//#endregion
//#region src/index.js
Z.install = (e) => {
	e.component("DateInput", Z);
};
var Q = Z;
//#endregion
export { Z as DateInput, Q as default };
