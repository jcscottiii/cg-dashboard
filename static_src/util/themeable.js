

const _registry = {};

function themeable(component) {
  const name = component.name;
  if (!name) {
    return component;
  }

  return name in _registry ? _registry[name] : component;
}

export function register(name, component) {
  _registry[name] = component;
}

export default themeable;
