import { VNode } from './vnode';
import options from './options';


const stack = [];

const EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
 *  Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *  @param {(string|!NodeName)} nodeName
 *  @param {(Object|undefined)} attributes
 *  @param {...?} args
 */
export function h(nodeName, attributes) {
	let children, lastSimple, child, simple, i;
	for (i=arguments.length; i-- > 2; ) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) instanceof Array) {
			for (i=child.length; i--; ) stack.push(child[i]);
		}
		else if (child!=null && child!==true && child!==false) {
			if (typeof child=='number') child = String(child);
			simple = typeof child=='string';
			if (simple && lastSimple) {
				children[children.length-1] += child;
			}
			else {
				(children || (children = [])).push(child);
				lastSimple = simple;
			}
		}
	}

	let p = new VNode(nodeName, attributes || undefined, children || EMPTY_CHILDREN);

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode) options.vnode(p);

	return p;
}
