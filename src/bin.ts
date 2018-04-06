#!/usr/bin/env node
import { writeFile } from 'fs'
import { normalize } from 'path'

import * as yargs from 'yargs'
import { importSchema } from 'graphql-import'

import { builtIns, expandSchema } from '.'

/* tslint:disable:no-unused-expression */
yargs
.strict()
.usage('Usage: $0')
.command(
  'expand <input> [output]',
  'Expand type definitions',
  {},
  args => {
    const basicTypes = importSchema(normalize(args.input))
    const typeDefs = expandSchema(basicTypes, 'mongo')

    if (args.output) {
      writeFile(normalize(args.output), typeDefs, 'utf8', error => {
        if (error) { console.log(error) }
      })
    } else {
      console.log(typeDefs)
    }
  }
)
.command(
  'builtins',
  'Print out built-in directives and scalars',
  {},
  () => console.log(builtIns)
)
.argv
