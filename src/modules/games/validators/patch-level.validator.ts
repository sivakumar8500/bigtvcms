/**
 * Patch (Block Fitting / Shikaku) Puzzle Level Validator
 * 
 * Enforces the core geometric and mathematical rules:
 * Rule 1: Pure Rectangles Only (w * h === cells.length)
 * Rule 2: Max Piece Area Cap (<= 6 on 5x5, <= 4 on 4x4, <= 9 on 6x6, <= 12 on 6x8)
 * Rule 3: Odd Number Constraint (odd area must be strictly vertical, horizontal, or a perfect square)
 * Rule 4: Clearability & Coverage (100% grid coverage, 0 collisions, within boundaries)
 * Clue Constraint: Shape must be 'sq' | 'wide' | 'tall', never 'poly'
 */

export interface ValidationIssue {
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class PatchLevelValidator {
  public static validate(content: any): ValidationResult {
    const errors: string[] = [];

    if (!content || typeof content !== 'object') {
      return { valid: false, errors: ['Content must be a valid JSON object.'] };
    }

    const rows = Number(content.grid?.rows || content.rows);
    const cols = Number(content.grid?.columns || content.columns);

    // 1. Grid validation
    if (!Number.isInteger(rows) || rows < 3 || rows > 10) {
      errors.push('Grid rows must be an integer between 3 and 10.');
    }
    if (!Number.isInteger(cols) || cols < 3 || cols > 10) {
      errors.push('Grid columns must be an integer between 3 and 10.');
    }

    // Determine max allowed area based on grid size / difficulty
    let maxAllowedArea = 6;
    if (rows <= 4 && cols <= 4) {
      maxAllowedArea = 4;
    } else if (rows === 5 && cols === 5) {
      maxAllowedArea = 6;
    } else if (rows === 6 && cols === 6) {
      maxAllowedArea = 9;
    } else {
      maxAllowedArea = 12;
    }

    // 2. Validate Clues
    if (Array.isArray(content.clues)) {
      content.clues.forEach((clue: any, idx: number) => {
        const r = clue.row ?? clue.r;
        const c = clue.col ?? clue.c;
        const val = clue.value ?? clue.area ?? clue.size;
        const shape = (clue.shape || '').toLowerCase();

        if (r === undefined || r < 0 || r >= rows) {
          errors.push(`Clue #${idx + 1} row ${r} is out of grid bounds (0..${rows - 1}).`);
        }
        if (c === undefined || c < 0 || c >= cols) {
          errors.push(`Clue #${idx + 1} col ${c} is out of grid bounds (0..${cols - 1}).`);
        }
        if (!val || val <= 0) {
          errors.push(`Clue #${idx + 1} has invalid value ${val}.`);
        }

        // Shape must never be 'poly'
        if (shape === 'poly') {
          errors.push(`Clue #${idx + 1} has shape "poly". Pure rectangles only ('sq' | 'wide' | 'tall').`);
        } else if (!['sq', 'wide', 'tall'].includes(shape)) {
          errors.push(`Clue #${idx + 1} shape must be 'sq', 'wide', or 'tall', received "${shape}".`);
        }

        // Rule 3: Odd number constraint for clues
        if (val && val % 2 !== 0) {
          const isSquare = Number.isInteger(Math.sqrt(val));
          if (shape === 'sq' && !isSquare) {
            errors.push(`Clue #${idx + 1} has odd value ${val} marked as 'sq' but is not a perfect square.`);
          }
        }
      });
    }

    // 3. Validate Pieces
    if (Array.isArray(content.pieces)) {
      content.pieces.forEach((piece: any, idx: number) => {
        const pId = piece.id || `p_${idx + 1}`;
        const rawCells = piece.cells || [];
        if (!Array.isArray(rawCells) || rawCells.length === 0) {
          errors.push(`Piece "${pId}" must contain non-empty cells array.`);
          return;
        }

        const coords = rawCells.map((cell: any) => {
          if (Array.isArray(cell)) return [Number(cell[0]), Number(cell[1])];
          return [Number(cell.row ?? cell.r ?? 0), Number(cell.col ?? cell.c ?? 0)];
        });

        const rValues = coords.map(([r]) => r);
        const cValues = coords.map(([, c]) => c);
        const minR = Math.min(...rValues);
        const maxR = Math.max(...rValues);
        const minC = Math.min(...cValues);
        const maxC = Math.max(...cValues);
        const w = maxC - minC + 1;
        const h = maxR - minR + 1;
        const area = coords.length;

        // Rule 1: Pure Rectangle Only
        if (w * h !== area) {
          errors.push(`Piece "${pId}" is not a pure rectangle (${area} cells within ${w}x${h} bounds). Irregular polyominoes are not allowed.`);
        }

        // Rule 2: Max Size Cap
        if (area > maxAllowedArea) {
          errors.push(`Piece "${pId}" area ${area} exceeds maximum allowed size (${maxAllowedArea}) for a ${rows}x${cols} board.`);
        }

        // Rule 3: Odd Number Constraint
        if (area % 2 !== 0) {
          const isSquare = w === h;
          const isLine = w === 1 || h === 1;
          if (!isSquare && !isLine) {
            errors.push(`Odd piece "${pId}" (area ${area}, ${w}x${h}) must be strictly single-line vertical, single-line horizontal, or square.`);
          }
        }
      });
    }

    // 4. Validate Solution & Coverage Check (Rule 4)
    if (Array.isArray(content.solution) && content.solution.length > 0) {
      const covered = new Map<string, string>(); // 'r-c' -> pieceId

      content.solution.forEach((sol: any, idx: number) => {
        const pId = sol.pieceId || `piece_${idx + 1}`;
        const rawCells = sol.cells || [];
        const coords = rawCells.map((cell: any) => {
          if (Array.isArray(cell)) return [Number(cell[0]), Number(cell[1])];
          return [Number(cell.row ?? cell.r ?? 0), Number(cell.col ?? cell.c ?? 0)];
        });

        if (coords.length === 0) {
          errors.push(`Solution placement for "${pId}" has no cells.`);
          return;
        }

        const rValues = coords.map(([r]: [number, number]) => r);
        const cValues = coords.map(([, c]: [number, number]) => c);
        const minR = Math.min(...rValues);
        const maxR = Math.max(...rValues);
        const minC = Math.min(...cValues);
        const maxC = Math.max(...cValues);
        const w = maxC - minC + 1;
        const h = maxR - minR + 1;

        if (w * h !== coords.length) {
          errors.push(`Solution piece "${pId}" is not a rectangle (${coords.length} cells in ${w}x${h} bbox).`);
        }

        coords.forEach(([r, c]: [number, number]) => {
          if (r < 0 || r >= rows || c < 0 || c >= cols) {
            errors.push(`Solution piece "${pId}" placed at (${r}, ${c}) outside grid (0..${rows - 1}, 0..${cols - 1}).`);
            return;
          }
          const key = `${r}-${c}`;
          if (covered.has(key)) {
            errors.push(`Collision at cell (${r}, ${c}) between "${pId}" and "${covered.get(key)}".`);
          } else {
            covered.set(key, pId);
          }
        });
      });

      if (covered.size !== rows * cols) {
        errors.push(`Board coverage incomplete: ${covered.size} cells covered out of ${rows * cols}. All cells must be covered.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
