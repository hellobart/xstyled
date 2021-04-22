/* eslint-disable no-continue, no-loop-func, no-cond-assign */
import styled, { StyledComponent, DefaultTheme } from 'styled-components'
import { compose, StyleGenerator } from '@xstyled/system'
import { createShouldForwardProp } from './createShouldForwardProp'

type JSXElementKeys = keyof JSX.IntrinsicElements

const tags = Object.keys(styled)

type SafeIntrinsicComponent<T extends keyof JSX.IntrinsicElements> = (
  props: Omit<JSX.IntrinsicElements[T], 'color'>,
) => React.ReactElement<any, T>

export const createX = <TProps extends object>(generator: StyleGenerator) => {
  type X<TProps extends object> = {
    extend<TExtendProps extends object>(
      ...generators: StyleGenerator[]
    ): X<TExtendProps>
  } & {
    [Key in JSXElementKeys]: StyledComponent<
      SafeIntrinsicComponent<Key>,
      DefaultTheme,
      TProps,
      'color'
    >
  }

  // @ts-ignore
  const x: X<TProps> = {
    extend: (...generators) => createX(compose(generator, ...generators)),
  }

  const shouldForwardProp = createShouldForwardProp(generator)

  tags.forEach((tag) => {
    // @ts-ignore
    x[tag] = styled(tag).withConfig({
      // @ts-ignore
      shouldForwardProp,
      // @ts-ignore
    })<TProps>(() => [`&&{`, generator, `}`])
  })

  return x
}
