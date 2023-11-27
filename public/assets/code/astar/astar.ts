
export type FFindNeighbors<T> = (cell: T, neighbors: Set<T>) => void;
export type FGetDistance<T> = (from: T, to: T, path: T[] | null) => number;

export type Node<T> = {
    score: number;
    path: T[];
};

export interface IAStarPathfinderParams<T> {
    find_neighbors: FFindNeighbors<T>;
    get_distance?: FGetDistance<T>;
    minRange?: number;
    maxRange?: number;

}

export class AStarPathfinder<T> {
    public min_range: number;
    public max_range: number;
    protected open: Map<T, Node<T>>;
    protected closed: Map<T, Node<T>>;
    private neighbors: Set<T>;
    private origin: T | undefined;
    private destination: T | undefined;

    public last_complexity: number = 0;
    public max_complexity: number = 256;

    constructor(params: IAStarPathfinderParams<T>) {
        let { find_neighbors, get_distance, minRange, maxRange } = params;

        if (!find_neighbors) {
            throw new Error("find_neighbors is required");
        } else {
            this.find_neighbors = find_neighbors;
        }

        if (get_distance) {
            this.get_distance = get_distance;
        }

        this.min_range = minRange || 0;
        this.max_range = maxRange || 0;
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

    protected static create_node<T>(path: T[] = [], score: number = 0): Node<T> {
        return { score, path };
    }

    public find_all_in_range(start: T): Iterable<T> {
        this.prepare();
        this.origin = start;
        this.destination = undefined;
        this.open.set(start, AStarPathfinder.create_node([start]));

        while (this.open.size > 0) {
            const closest = this.close_closest_open_node();
            if (closest && closest[1].score >= this.min_range && (this.max_range === 0 || closest[1].score <= this.max_range)) {
                this.all_option_callback(closest[0]);
            }
            if (this.quit_early(closest[0])) {
                break;
            }

            this.maybe_queue_neighbors(closest);
        }

        if (this.min_range > 0) {
            return Array.from(this.closed.keys()).filter(t => this.closed.get(t)!.score >= this.min_range && (this.max_range === 0 || this.closed.get(t)!.score <= this.max_range));
        }
        return this.closed.keys();
    }

    public find_path(start: T, end: T): T[] | null {
        this.prepare();
        this.origin = start;
        this.destination = end;
        this.open.set(start, AStarPathfinder.create_node([start]));

        let shortest_path: [T, Node<T>] | null = null;
        while (this.open.size > 0) {
            const lowest = this.close_lowest_score_open_node();
            if (lowest && (lowest[0] === end || this.quit_early(lowest[0]))) {
                shortest_path = lowest;
                break;
            }
            
            this.last_complexity++;

            if (this.last_complexity > this.max_complexity) {
                console.log(`Max complexity reached: ${this.last_complexity}`);
                break;
            }

            this.maybe_queue_neighbors(lowest);
        }

        if (!shortest_path || !shortest_path[1]) {
            console.log(`No path between ${start} and ${end}`);
            return null;
        }

        shortest_path[1].path.forEach(t => {
            this.path_callback(t, shortest_path[1].path);
        });

        return shortest_path[1].path;
    }

    protected add_neighbour(neighbor: T): void {
        this.neighbors.add(neighbor);
    }

    protected find_neighbors(cell: T, neighbors: Set<T>): void {
        throw new Error("Not implemented");
    };

    protected prepare(): void {
        this.last_complexity = 0;

        this.open.clear();
        this.closed.clear();
    }

    protected get_distance(from: T, to: T, path: T[] | null): number {
        return path ? path.length : 0;
    }

    protected quit_early(cell: T): boolean {
        return false;
    }

    protected is_valid_path(cell: T): boolean {
        return true;
    }

    protected path_callback(pathNode: T, path: T[]): void { }

    protected all_option_callback(pathNode: T): void { }

    private maybe_queue_neighbors(pair: [T, Node<T>]): void {
        this.find_neighbors(pair[0], this.neighbors);
        this.neighbors.forEach(neighbor => {
            const new_path = [...pair[1].path, neighbor];
            this.maybe_queue_neighbor(pair[1], new_path, neighbor);
        });
        this.neighbors.clear();
    }

    private maybe_queue_neighbor(node: Node<T>, new_path: T[], neighbor: T): void {
        if (!this.is_valid_path(neighbor)) {
            return;
        }

        let new_score = this.get_distance(this.origin!, neighbor, new_path);
        if (this.destination) {
            new_score += this.get_distance(neighbor, this.destination, null);
        }

        if (this.max_range !== 0 && new_score > this.max_range) {
            return;
        }

        if (!this.open.has(neighbor) && !this.closed.has(neighbor)) {
            this.open.set(neighbor, AStarPathfinder.create_node(new_path, new_score));
            return;
        }

        if (this.open.has(neighbor) && new_score < this.open.get(neighbor)!.score) {
            const updatingNode = this.open.get(neighbor)!;
            updatingNode.path = new_path;
            updatingNode.score = new_score;
            return;
        }

        if (this.closed.has(neighbor) && new_score < this.closed.get(neighbor)!.score) {
            const updating_node = this.closed.get(neighbor)!;
            updating_node.path = new_path;
            updating_node.score = new_score;
            this.open.set(neighbor, updating_node);
            this.closed.delete(neighbor);
            return;
        }
    }

    private close_lowest_score_open_node(): [T, Node<T>] | null {
        if (this.open.size === 0) {
            return null;
        }
        let lowest = Array.from(this.open.entries()).reduce((a, b) => a[1].score < b[1].score ? a : b);
        this.open.delete(lowest[0]);
        this.closed.set(lowest[0], lowest[1]);
        return lowest;
    }

    private close_closest_open_node(): [T, Node<T>] | null {
        if (this.open.size === 0) {
            return null;
        }
        let closest = Array.from(this.open.entries()).reduce((a, b) => a[1].path.length < b[1].path.length ? a : b);
        this.open.delete(closest[0]);
        this.closed.set(closest[0], closest[1]);
        return closest;
    }
}