package mn.itzone.web.rest;

import mn.itzone.domain.Customer;
import mn.itzone.domain.History;
import mn.itzone.repository.CustomerRepository;
import mn.itzone.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequestMapping("ftp")
public class FtpController {

    @Value("${file.directory}")
    String localDirectory = "/Users/sainturb/";

    File f = null;
    String[] paths;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    HistoryRepository historyRepository;

    @GetMapping("list")
    public ResponseEntity<List<?>> getList(@RequestParam String path) throws Exception {
        try {
            if (path.equals("parent")) {
                f = new File(localDirectory);
            } else {
                f = new File(localDirectory + path);
            }
            paths = f.list();
            Arrays.sort(paths);
            List<String> stringList = new ArrayList<>();
            for( String one: paths) {
                if (one.charAt(0) != '.') {
                    if (one.contains(".")) {
                        if (one.contains(".mp4")) {
                            stringList.add(one);
                        }
                    } else {
                        stringList.add(one);
                    }
                }
            }
            return ResponseEntity.ok(stringList);
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("episodes")
    public ResponseEntity<List<?>> getEpisodes(@RequestParam String path) throws Exception {
        try {
            if (path.equals("parent")) {
                f = new File(localDirectory);
            } else {
                f = new File(localDirectory + path);
            }
            paths = f.list();
            Arrays.sort(paths);
            List<String> stringList = new ArrayList<>();
            for( String one: paths) {
                if (one.contains(".") && one.contains(".mp4")) {
                    stringList.add(one);
                }
            }
            return ResponseEntity.ok(stringList);
        } catch (Exception e) {
            throw e;
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()) {
            if (customer.get().getPassword().equals(password)) {
                return ResponseEntity.ok(username);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("save")
    public ResponseEntity<History> save(@RequestParam String path, @RequestParam String parent, @RequestParam String username) {
        Optional<History> history = historyRepository.findByUsernameAndParent(username, parent);
        String[] steps = path.split(Pattern.quote("/"));
        History saved = null;
        if (history.isPresent()) {
            History found = history.get();
            found.setEpisode(steps[steps.length - 1]);
            found.setPath(path);
            saved = historyRepository.save(found);
        } else {
            History created = new History();
            created.setPath(path);
            created.setEpisode(steps[steps.length - 1]);
            created.setUsername(username);
            created.setParent(parent);
            saved = historyRepository.save(created);
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("history")
    public ResponseEntity<List<History>> histories(@RequestParam String username) {
        return ResponseEntity.ok(historyRepository.findByUsername(username));
    }
}
