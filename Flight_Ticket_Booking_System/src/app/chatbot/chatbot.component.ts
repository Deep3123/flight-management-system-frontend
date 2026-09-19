import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private http: HttpClient) {}

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

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userText = this.userInput;
    this.messages.push({ text: userText, isBot: false });
    this.userInput = '';
    this.isLoading = true;

    // Call the backend API
    this.http.post<{response: string}>(`${environment.apiHost}/api/chat`, { message: userText })
      .subscribe({
        next: (res) => {
          this.messages.push({ text: res.response, isBot: true });
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.messages.push({ text: 'Sorry, I am having trouble connecting to the server right now.', isBot: true });
          this.isLoading = false;
        }
      });
  }
}
