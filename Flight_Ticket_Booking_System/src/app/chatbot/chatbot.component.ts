import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { API_BASE_URL } from '../constats';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: false
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  private routerSub: Subscription;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private http: HttpClient, private router: Router) {
    // Auto-close chat window on navigation (standard SPA behavior)
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isOpen = false;
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    // Initial greeting
    this.messages.push({
      text: 'Hello! I am your JetWayz AI assistant. How can I help you with your flight bookings today?',
      isBot: true
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  clearChat() {
    this.messages = [{
      text: 'Hello! I am your JetWayz AI assistant. How can I help you with your flight bookings today?',
      isBot: true
    }];
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userText = this.userInput;
    this.messages.push({ text: userText, isBot: false });
    this.userInput = '';
    this.isLoading = true;

    // Create a placeholder for the bot's streamed response
    const botMsgIndex = this.messages.push({ text: '', isBot: true }) - 1;

    // Call the backend API with streaming enabled
    this.http.post(`${API_BASE_URL}/api/chat`, { message: userText }, {
      responseType: 'text',
      observe: 'events',
      reportProgress: true
    }).subscribe({
      next: (event: any) => {
        // HttpEventType.DownloadProgress (3) or HttpEventType.Response (4)
        if (event.type === 3 || event.type === 4) {
          this.isLoading = false;
          const text = event.type === 4 ? event.body : (event as any).partialText;
          
          if (text) {
            // Spring Web MVC streams SSE as "data:<chunk>\n\n"
            // We strip out the "data:" and newlines to form the continuous string
            let cleanedText = text.replace(/data:/g, '').replace(/\n\n/g, '');
            this.messages[botMsgIndex].text = cleanedText;
            this.scrollToBottom();
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.messages[botMsgIndex].text = 'Sorry, I am having trouble connecting to the server right now.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
