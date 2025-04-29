interface WheelSegment {
  name: string;
  color: string;
}

export class SpinningWheel {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerX: number;
  private centerY: number;
  private radius: number;
  private segments: WheelSegment[] = [];
  private isSpinning: boolean = false;
  private rotation: number = Math.random() * Math.PI * 2;
  private spinAngle: number = 0;
  private deceleration: number = 0.97 + Math.random() * 0.02; // Random deceleration between 0.98 and 0.99
  private minSpinSpeed: number = 0.001;
  private currentSpinSpeed: number = 0;
  private nameInput: HTMLInputElement;
  private namesList: HTMLUListElement;
  private winnerDisplay: HTMLDivElement;

  // Predefined colors for wheel segments
  private colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8AC148', '#F25278',
    '#6ACDEB', '#FF8C52', '#00D2B8', '#F68FFF'
  ];

  constructor() {
    // Initialize canvas and context
    this.canvas = document.getElementById('wheel') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.centerX, this.centerY) - 10;
    
    // Get DOM elements
    this.nameInput = document.getElementById('name-input') as HTMLInputElement;
    this.namesList = document.getElementById('names-container') as HTMLUListElement;
    this.winnerDisplay = document.getElementById('winner-display') as HTMLDivElement;
    
    // Add event listeners
    document.getElementById('add-name-btn')?.addEventListener('click', () => this.addName());
    document.getElementById('reset-btn')?.addEventListener('click', () => this.resetNames());
    document.getElementById('spin-btn')?.addEventListener('click', () => this.startSpin());
    
    // Add ability to press Enter to add a name
    this.nameInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.addName();
      }
    });
    
    // Load saved names from localStorage if available
    this.loadNames();
    
    // Draw initial wheel
    this.drawWheel();
  }

  private loadNames(): void {
    const savedNames = localStorage.getItem('wheelNames');
    if (savedNames) {
      const names = JSON.parse(savedNames);
      names.forEach((name: string) => this.addNameToWheel(name));
    }
    
    // Add default names if none are saved
    if (this.segments.length === 0) {
      ['Alice', 'Bob', 'Charlie', 'David'].forEach(name => this.addNameToWheel(name));
    }
  }

  private saveNames(): void {
    const names = this.segments.map(segment => segment.name);
    localStorage.setItem('wheelNames', JSON.stringify(names));
  }

  private addName(): void {
    const name = this.nameInput.value.trim();
    if (name) {
      this.addNameToWheel(name);
      this.nameInput.value = '';
      this.nameInput.focus();
    }
  }

  private addNameToWheel(name: string): void {
    // Add name to segments array
    const colorIndex = this.segments.length % this.colors.length;
    this.segments.push({ name, color: this.colors[colorIndex] });
    
    // Update the UI
    this.updateNamesList();
    this.drawWheel();
    this.saveNames();
  }

  private updateNamesList(): void {
    // Clear the current list
    this.namesList.innerHTML = '';
    
    // Add each name to the list
    this.segments.forEach((segment, index) => {
      const li = document.createElement('li');
      li.textContent = segment.name;
      
      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', () => this.removeName(index));
      li.appendChild(deleteBtn);
      
      this.namesList.appendChild(li);
    });
  }

  private removeName(index: number): void {
    this.segments.splice(index, 1);
    this.updateNamesList();
    this.drawWheel();
    this.saveNames();
  }

  private resetNames(): void {
    this.segments = [];
    this.updateNamesList();
    this.drawWheel();
    this.saveNames();
    this.winnerDisplay.textContent = '';
  }

  private drawWheel(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw wheel background (white circle)
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // If no segments, draw a message
    if (this.segments.length === 0) {
      this.ctx.fillStyle = '#333';
      this.ctx.font = '20px Roboto';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Add names to start!', this.centerX, this.centerY);
      return;
    }
    
    // Draw segments
    const segmentAngle = (2 * Math.PI) / this.segments.length;
    
    for (let i = 0; i < this.segments.length; i++) {
      // Make sure the segment exists before trying to access its properties
      if (!this.segments[i]) {
        console.error(`Segment at index ${i} is undefined. Total segments: ${this.segments.length}`);
        continue;
      }
      
      const startAngle = this.rotation + i * segmentAngle;
      const endAngle = this.rotation + (i + 1) * segmentAngle;
      
      // Draw segment
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
      this.ctx.closePath();
      
      this.ctx.fillStyle = this.segments[i].color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw segment text
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(startAngle + segmentAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 16px Roboto';
      this.ctx.fillText(this.segments[i].name, this.radius - 20, 6);
      this.ctx.restore();
    }
    
    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
    
    // Draw larger pointer at the top of the wheel
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY - this.radius + 10); // Point slightly overlapping the wheel
    this.ctx.lineTo(this.centerX - 25, this.centerY - this.radius - 30); // Left point of triangle (wider)
    this.ctx.lineTo(this.centerX + 25, this.centerY - this.radius - 30); // Right point of triangle (wider)
    this.ctx.closePath();
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private startSpin(): void {
    if (this.isSpinning || this.segments.length === 0) return;
    
    this.isSpinning = true;
    this.currentSpinSpeed = 0.2 + Math.random() * 0.3; // Random speed between 0.2 and 0.5
    this.spinAngle = 0;
    this.winnerDisplay.textContent = '';
    
    // Disable spin button during spin
    const spinBtn = document.getElementById('spin-btn') as HTMLElement;
    spinBtn.style.pointerEvents = 'none';
    spinBtn.textContent = 'SPINNING';
    
    this.animateSpin();
  }

  private animateSpin(): void {
    // Update rotation
    this.rotation += this.currentSpinSpeed;
    this.spinAngle += this.currentSpinSpeed;
    this.currentSpinSpeed *= this.deceleration;
    
    // Keep rotation within 0 to 2π
    this.rotation %= (2 * Math.PI);
    
    // Draw the wheel at its current rotation
    this.drawWheel();
    
    // Continue spinning until it slows down enough
    if (this.currentSpinSpeed > this.minSpinSpeed) {
      requestAnimationFrame(() => this.animateSpin());
    } else {
      this.finishSpin();
    }
  }

  private finishSpin(): void {
    this.isSpinning = false;
    
    // Re-enable spin button
    const spinBtn = document.getElementById('spin-btn') as HTMLElement;
    spinBtn.style.pointerEvents = 'auto';
    spinBtn.textContent = 'SPIN';
    
    // Determine winner
    if (this.segments.length === 0) return;
    
    const segmentAngle = (2 * Math.PI) / this.segments.length;
    
    // Fixed winner determination logic
    // The pointer is at the top (Math.PI * 3/2 in the standard coordinate system)
    // We need to find which segment is at the position pointed to by the triangle
    let winnerIndex = Math.floor((Math.PI * 1.5 - this.rotation) / segmentAngle);
    
    // Normalize the index to ensure it's within bounds
    winnerIndex = ((winnerIndex % this.segments.length) + this.segments.length) % this.segments.length;
    
    // Display the winner
    if (this.segments[winnerIndex]) {
      const winner = this.segments[winnerIndex].name;
      this.winnerDisplay.textContent = `Winner: ${winner}!`;
      
      // Create a celebratory animation for the winner
      this.winnerDisplay.style.animation = 'none';
      setTimeout(() => {
        this.winnerDisplay.style.animation = 'pulse 0.5s 3';
      }, 10);
    } else {
      console.error("Winner segment is undefined", { winnerIndex, segments: this.segments });
      this.winnerDisplay.textContent = "Error determining winner!";
    }
  }
}