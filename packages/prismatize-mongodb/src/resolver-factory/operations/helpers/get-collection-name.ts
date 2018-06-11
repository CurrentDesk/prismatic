import { tableize } from 'inflected'

export const getCollectionName = (modelName: string) => tableize(modelName)
