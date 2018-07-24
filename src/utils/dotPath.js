// https://stackoverflow.com/a/6394168

// getDotPath(obj,"a.b.etc") will get obj.a.b.etc
export function getDotPath(obj, path) {
	return path.split('.').reduce((o, i) => o[i], obj);
}

// setDotPath(obj,"a.b.etc", value) will set obj.a.b.etc = value
export function setDotPath(obj, is, value) {
	if (typeof is === 'string') return setDotPath(obj, is.split('.'), value);
	else if (is.length === 1 && value !== undefined) return (obj[is[0]] = value);
	else if (is.length === 0) return obj;
	else return setDotPath(obj[is[0]], is.slice(1), value);
}
