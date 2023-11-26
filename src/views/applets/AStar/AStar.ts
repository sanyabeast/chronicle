export type Node<T> = {
    score: number;
    path: T[];
};

export abstract class AStarPathfinder<T> {
    public minRange: number;
    public maxRange: number;
    protected open: Map<T, Node<T>>;
    protected closed: Map<T, Node<T>>;
    private neighbors: Set<T>;
    private origin: T | undefined;
    private destination: T | undefined;

    constructor() {
        this.minRange = 0;
        this.maxRange = 0;
        this.open = new Map<T, Node<T>>();
        this.closed = new Map<T, Node<T>>();
        this.neighbors = new Set<T>();
    }

    public get reachable(): Map<T, T[]> {
        const result = new Map<T, T[]>();
        this.closed.forEach((value, key) => {
            result.set(key, value.path);
        });
        return result;
    }

    protected static createNode<T>(path: T[] = [], score: number = 0): Node<T> {
        return { score, path };
    }

    public findAllInRange(start: T): Iterable<T> {
        this.prepare();
        this.origin = start;
        this.destination = undefined;
        this.open.set(start, AStarPathfinder.createNode([start]));

        while (this.open.size > 0) {
            const closest = this.closeClosestOpenNode();
            if (closest && closest[1].score >= this.minRange && (this.maxRange === 0 || closest[1].score <= this.maxRange)) {
                this.allOptionCallback(closest[0]);
            }
            if (this.quitEarly(closest[0])) {
                break;
            }
            this.maybeQueueNeighbors(closest);
        }

        if (this.minRange > 0) {
            return Array.from(this.closed.keys()).filter(t => this.closed.get(t)!.score >= this.minRange && (this.maxRange === 0 || this.closed.get(t)!.score <= this.maxRange));
        }
        return this.closed.keys();
    }

    public findPath(start: T, end: T): T[] | null {
        this.prepare();
        this.origin = start;
        this.destination = end;
        this.open.set(start, AStarPathfinder.createNode([start]));

        let shortestPath: [T, Node<T>] | null = null;
        while (this.open.size > 0) {
            const lowest = this.closeLowestScoreOpenNode();
            if (lowest && (lowest[0] === end || this.quitEarly(lowest[0]))) {
                shortestPath = lowest;
                break;
            }
            this.maybeQueueNeighbors(lowest);
        }

        if (!shortestPath || !shortestPath[1]) {
            console.log(`No path between ${start} and ${end}`);
            return null;
        }

        shortestPath[1].path.forEach(t => {
            this.pathCallback(t, shortestPath[1].path);
        });

        return shortestPath[1].path;
    }

    protected addNeighbor(neighbor: T): void {
        this.neighbors.add(neighbor);
    }

    protected abstract findNeighbors(cell: T): void;

    protected prepare(): void {
        this.open.clear();
        this.closed.clear();
    }

    protected get_distance(from: T, to: T, path: T[] | null): number {
        return path ? path.length : 0;
    }

    protected quitEarly(cell: T): boolean {
        return false;
    }

    protected is_valid_path(cell: T): boolean {
        return true;
    }

    protected pathCallback(pathNode: T, path: T[]): void { }

    protected allOptionCallback(pathNode: T): void { }

    private maybeQueueNeighbors(pair: [T, Node<T>]): void {
        this.findNeighbors(pair[0]);
        this.neighbors.forEach(neighbor => {
            const newPath = [...pair[1].path, neighbor];
            this.maybeQueueNeighbor(pair[1], newPath, neighbor);
        });
        this.neighbors.clear();
    }

    private maybeQueueNeighbor(node: Node<T>, newPath: T[], neighbor: T): void {
        if (!this.is_valid_path(neighbor)) {
            return;
        }

        let newScore = this.get_distance(this.origin!, neighbor, newPath);
        if (this.destination) {
            newScore += this.get_distance(neighbor, this.destination, null);
        }

        if (this.maxRange !== 0 && newScore > this.maxRange) {
            return;
        }

        if (!this.open.has(neighbor) && !this.closed.has(neighbor)) {
            this.open.set(neighbor, AStarPathfinder.createNode(newPath, newScore));
            return;
        }

        if (this.open.has(neighbor) && newScore < this.open.get(neighbor)!.score) {
            const updatingNode = this.open.get(neighbor)!;
            updatingNode.path = newPath;
            updatingNode.score = newScore;
            return;
        }

        if (this.closed.has(neighbor) && newScore < this.closed.get(neighbor)!.score) {
            const updatingNode = this.closed.get(neighbor)!;
            updatingNode.path = newPath;
            updatingNode.score = newScore;
            this.open.set(neighbor, updatingNode);
            this.closed.delete(neighbor);
            return;
        }
    }

    private closeLowestScoreOpenNode(): [T, Node<T>] | null {
        if (this.open.size === 0) {
            return null;
        }
        let lowest = Array.from(this.open.entries()).reduce((a, b) => a[1].score < b[1].score ? a : b);
        this.open.delete(lowest[0]);
        this.closed.set(lowest[0], lowest[1]);
        return lowest;
    }

    private closeClosestOpenNode(): [T, Node<T>] | null {
        if (this.open.size === 0) {
            return null;
        }
        let closest = Array.from(this.open.entries()).reduce((a, b) => a[1].path.length < b[1].path.length ? a : b);
        this.open.delete(closest[0]);
        this.closed.set(closest[0], closest[1]);
        return closest;
    }
}