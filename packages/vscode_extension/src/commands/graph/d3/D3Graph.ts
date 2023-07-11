export class D3Graph {
    type = "force";
    categories: GraphCategories[] = [];
    nodes: GraphNode[] = [];
    edges: GraphLink[] = [];

    addCategory(name: string): number {
        if(this.categories.find(cat => cat.name === name)) {
            console.warn(`A category named '${name}' already exists.`);
            return -1;
        } else {
            this.categories.push({
                base: name,
                category: this.categories.length,
                name: name,
                value: this.categories.length
            });
            return this.categories.length - 1;
        }
    }

    addNode(value: string, category: number) {
        if(this.nodes.find(node => node.name === value)) {
            console.warn(`A node named '${value}' already exists.`);
        } else {
            this.nodes.push({
                name: value,
                id: value,
                category: category
            });
        }
    }

    addEdge(source: string, target: string) {
        const sourceIndex = this.nodes.findIndex(node => node.name === source);
        const targetIndex = this.nodes.findIndex(node => node.name === target);
        if(sourceIndex === -1) {
            console.warn(`A node named '${source}' doesn't exist.`);
        } if(targetIndex === -1) {
            console.warn(`A node named '${target}' doesn't exist.`);
        }
        if(sourceIndex !== -1 && targetIndex !== -1) {
            this.edges.push({
                source: sourceIndex,
                target: targetIndex
            });
        }
    }

    toJson(): string {
        return JSON.stringify({
            type: this.type,
            categories: this.categories,
            nodes: this.nodes,
            links: this.edges
        });
    }
}



interface GraphCategories {
    category: number
    value: number
    name: string
    base: string
}

interface GraphNode {
    name: string
    id: string
    category: number
}

interface GraphLink {
    source: number
    target: number
}