type IdentifiableObject<T> = {
    id: string
    data: T
}

export function update<U, T extends IdentifiableObject<U>, V extends T>(oldArray: V[], newArray: T[], convertFunction: (elem: T) => V): V[] {
    const oldById = new Map(oldArray.map<[string, V]>(elem => [elem.id, elem]))
    const newById = new Map(newArray.map<[string, T]>(elem => [elem.id, elem]))
    const oldKeys = Array.from(oldById.keys())
    const existingIds = Array.from(newById.keys()).filter(id => oldKeys.includes(id))
    const result: V[] = []
    for(const [id, elem] of newById) {
        if(existingIds.includes(id)) {
            result.push({
                ...oldById.get(id),
                data: elem.data
            })
        } else {
            result.push(convertFunction(newById.get(id)))
        }
    }
    return result
}