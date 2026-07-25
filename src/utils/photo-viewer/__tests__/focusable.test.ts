import { getFocusableElements } from '../focusable';

function mount(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getFocusableElements', () => {
  it('returns focusable descendants in document order', () => {
    const container = mount(`
      <button id="a"></button>
      <a id="b" href="#x"></a>
      <input id="c" />
    `);

    expect(getFocusableElements(container).map((el) => el.id)).toEqual(['a', 'b', 'c']);
  });

  it('skips disabled controls', () => {
    const container = mount('<button id="a"></button><button id="b" disabled></button>');

    expect(getFocusableElements(container).map((el) => el.id)).toEqual(['a']);
  });

  it('skips tabindex="-1", including a trap container that carries it', () => {
    const container = mount('<div id="inner" tabindex="-1"></div><button id="a"></button>');
    container.setAttribute('tabindex', '-1');

    expect(getFocusableElements(container).map((el) => el.id)).toEqual(['a']);
  });

  it('skips elements inside an aria-hidden subtree', () => {
    const container = mount(`
      <div aria-hidden="true"><button id="hidden"></button></div>
      <button id="a"></button>
    `);

    expect(getFocusableElements(container).map((el) => el.id)).toEqual(['a']);
  });

  it('skips [hidden] elements', () => {
    const container = mount('<button id="a"></button><button id="b" hidden></button>');

    expect(getFocusableElements(container).map((el) => el.id)).toEqual(['a']);
  });

  it('returns an empty array when nothing is focusable', () => {
    const container = mount('<div></div><span></span>');

    expect(getFocusableElements(container)).toEqual([]);
  });
});
